package dev.portfolio.contact;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * The contact endpoint.
 *
 * <pre>
 *   POST /api/contact         take a message
 *   GET  /api/contact/health  liveness, for uptime checks
 * </pre>
 *
 * <p>Responses are shaped for assets/js/contact-form.js: always a JSON object
 * with a {@code message}, plus an {@code errors} map of field to message when
 * validation fails, so the page can mark the right inputs.</p>
 */
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submit(@Valid @RequestBody ContactRequest request,
                                                      HttpServletRequest http) {

        // Honeypot filled in: answer 200 as though it worked, so the bot learns
        // nothing, and store none of it.
        if (request.looksAutomated()) {
            log.info("Dropped a submission with the honeypot filled in");
            return ResponseEntity.ok(Map.of("message", "Message sent"));
        }

        ContactMessage saved = service.accept(
                request,
                clientIp(http),
                http.getHeader("User-Agent")
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Message sent. I will reply within a day or two.",
                "id", saved.getId()
        ));
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    /**
     * Best guess at the sender's address.
     *
     * <p>Behind nginx or Cloudflare, remoteAddr is the proxy, so X-Forwarded-For
     * comes first and the leftmost entry is the original client.</p>
     *
     * <p><b>Caveat:</b> anyone calling the app directly can forge that header.
     * It is trustworthy only when a correctly configured proxy sits in front.
     * Here it feeds rate limiting, which can live with that.</p>
     */
    private static String clientIp(HttpServletRequest http) {
        String forwarded = http.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return http.getRemoteAddr();
    }
}
