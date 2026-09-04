package dev.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * What the form sends.
 *
 * <p><b>These rules must match RULES in assets/js/contact-form.js.</b> The
 * JavaScript checks exist to tell the visitor quickly; they are not a security
 * boundary, because anyone can POST straight at this endpoint without ever
 * loading the page. This is the check that counts.</p>
 *
 * @param name    who is writing
 * @param email   where the reply goes
 * @param subject optional
 * @param message the actual message
 * @param website honeypot: a human always leaves this empty
 */
public record ContactRequest(

        @NotBlank(message = "Please enter your name")
        @Size(min = 2, max = 80, message = "Between 2 and 80 characters, please")
        String name,

        @NotBlank(message = "Please enter an email address")
        @Email(message = "That does not look like an email address")
        @Size(max = 160, message = "That address is too long")
        String email,

        @Size(max = 120, message = "Subject is too long (120 characters max)")
        String subject,

        @NotBlank(message = "Please write a message")
        @Size(min = 10, max = 2000, message = "At least 10 characters, up to 2,000")
        String message,

        String website
) {

    /** True when the honeypot was filled in, which effectively means a bot. */
    public boolean looksAutomated() {
        return website != null && !website.isBlank();
    }

    /** Subject to store, with a fallback when none was given. */
    public String subjectOrDefault() {
        return (subject == null || subject.isBlank()) ? "Message from the portfolio site" : subject.trim();
    }
}
