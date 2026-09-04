package dev.portfolio.contact;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

/**
 * Everything that happens to an incoming message: rate limit, store, notify.
 *
 * <p>Storing and emailing are deliberately separate. If SMTP is down the
 * message must not be lost, so the visitor is only told it worked once the row
 * is committed. The email is a convenience on top of that, not the record.</p>
 */
@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactRepository repository;
    private final ContactProperties props;

    /**
     * ObjectProvider because JavaMailSender may not exist at all when SMTP is
     * unconfigured. This way the app still boots.
     */
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    /**
     * First rate-limit tier: recent send times per IP, in memory. Fast, touches
     * no database, and empty after a restart - which is why enforceRateLimit
     * also asks the table.
     */
    private final Map<String, Deque<Instant>> recentByIp = new ConcurrentHashMap<>();

    public ContactService(ContactRepository repository,
                          ContactProperties props,
                          ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.repository = repository;
        this.props = props;
        this.mailSenderProvider = mailSenderProvider;
    }

    /**
     * Take one message.
     *
     * @return the stored row, with the id the database assigned
     * @throws RateLimitExceededException when this IP is over the limit
     */
    @Transactional
    public ContactMessage accept(ContactRequest request, String remoteIp, String userAgent) {
        enforceRateLimit(remoteIp);

        ContactMessage saved = repository.save(new ContactMessage(
                request.name().trim(),
                request.email().trim().toLowerCase(),
                request.subjectOrDefault(),
                request.message().trim(),
                remoteIp,
                truncate(userAgent, 255)
        ));

        log.info("Stored message #{} from {}", saved.getId(), saved.getEmail());

        notifyByEmail(saved);
        return saved;
    }

    /* ---------------------------------------------------------------------
       Rate limiting
       --------------------------------------------------------------------- */

    private void enforceRateLimit(String remoteIp) {
        if (remoteIp == null || remoteIp.isBlank()) return;

        int max = props.rateLimit().maxPerWindow();
        Duration window = Duration.ofMinutes(props.rateLimit().windowMinutes());
        Instant since = Instant.now().minus(window);

        String tooMany = "That is a lot of messages. Try again in "
                + props.rateLimit().windowMinutes() + " minutes.";

        // Tier 1: in memory, answers immediately.
        Deque<Instant> hits = recentByIp.computeIfAbsent(remoteIp, key -> new ConcurrentLinkedDeque<>());
        hits.removeIf(at -> at.isBefore(since));

        if (hits.size() >= max) {
            throw new RateLimitExceededException(tooMany);
        }

        // Tier 2: the table, which survives a restart.
        if (repository.countByRemoteIpAndCreatedAtAfter(remoteIp, since) >= max) {
            throw new RateLimitExceededException(tooMany);
        }

        hits.addLast(Instant.now());

        // Keep the map from growing without bound on a long-running server.
        if (recentByIp.size() > 5_000) {
            recentByIp.entrySet().removeIf(entry -> entry.getValue().isEmpty());
        }
    }

    /* ---------------------------------------------------------------------
       Notification
       --------------------------------------------------------------------- */

    private void notifyByEmail(ContactMessage saved) {
        if (!props.mail().enabled()) {
            log.debug("Mail disabled; message #{} stored only", saved.getId());
            return;
        }

        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null) {
            log.warn("contact.mail.enabled is on but no SMTP is configured; skipping the email");
            return;
        }

        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setFrom(props.mail().from());
            mail.setTo(props.mail().to());
            // Replying should reach the sender, not the no-reply mailbox.
            mail.setReplyTo(saved.getEmail());
            mail.setSubject("[Portfolio] " + saved.getSubject());
            mail.setText("""
                    New message from the portfolio site.

                    Name    : %s
                    Email   : %s
                    Subject : %s
                    Time    : %s

                    ---------------------------------------
                    %s
                    ---------------------------------------
                    """.formatted(
                    saved.getName(), saved.getEmail(), saved.getSubject(),
                    saved.getCreatedAt(), saved.getMessage()));

            sender.send(mail);
            log.info("Notification sent for message #{}", saved.getId());

        } catch (Exception ex) {
            // Swallowed on purpose. The message is already stored; the visitor
            // should not see an error because our mail server is unhappy.
            log.error("Could not send the notification for message #{}: {}", saved.getId(), ex.getMessage());
        }
    }

    private static String truncate(String value, int max) {
        if (value == null) return null;
        return value.length() <= max ? value : value.substring(0, max);
    }
}
