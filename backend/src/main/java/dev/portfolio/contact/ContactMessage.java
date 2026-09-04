package dev.portfolio.contact;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

/**
 * One stored message.
 *
 * <p>IP and user agent are kept so a burst of spam can be traced back to a
 * source. If you would rather not store identifying data, drop those two
 * columns and the rate limiter falls back to its in-memory half.</p>
 */
@Entity
@Table(name = "contact_message")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(length = 120)
    private String subject;

    // 2,000 to match the validation limit on ContactRequest.
    @Column(nullable = false, length = 2000)
    private String message;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "remote_ip", length = 64)
    private String remoteIp;

    @Column(name = "user_agent", length = 255)
    private String userAgent;

    /** JPA needs a no-arg constructor. Do not remove. */
    protected ContactMessage() {
    }

    public ContactMessage(String name, String email, String subject, String message,
                          String remoteIp, String userAgent) {
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
        this.remoteIp = remoteIp;
        this.userAgent = userAgent;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public Instant getCreatedAt() { return createdAt; }
    public String getRemoteIp() { return remoteIp; }
    public String getUserAgent() { return userAgent; }
}
