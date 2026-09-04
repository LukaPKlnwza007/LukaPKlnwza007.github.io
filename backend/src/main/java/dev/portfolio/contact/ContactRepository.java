package dev.portfolio.contact;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

/** Storage for contact messages. Spring Data supplies the implementation. */
public interface ContactRepository extends JpaRepository<ContactMessage, Long> {

    /**
     * Count messages from one IP since a given moment.
     *
     * <p>This is the second rate-limit check. The first lives in memory and is
     * faster, but it is empty after a restart, which is exactly when someone
     * hammering the endpoint would get a free pass.</p>
     */
    long countByRemoteIpAndCreatedAtAfter(String remoteIp, Instant since);
}
