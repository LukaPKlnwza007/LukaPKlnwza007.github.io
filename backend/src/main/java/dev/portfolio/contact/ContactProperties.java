package dev.portfolio.contact;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

/**
 * Everything configurable about the contact feature, bound from the "contact"
 * prefix in application.properties.
 *
 * <p>Records, so the values are immutable: set once at boot and impossible to
 * mutate at runtime, which removes a whole category of "the config changed
 * under us" bugs.</p>
 */
@ConfigurationProperties(prefix = "contact")
public record ContactProperties(Mail mail, Cors cors, RateLimit rateLimit) {

    /** Notification email. Can be switched off without affecting storage. */
    public record Mail(boolean enabled, String to, String from) {}

    /** Origins allowed to call this API cross-origin. */
    public record Cors(List<String> origins) {}

    /** How many messages one IP may send inside a window. */
    public record RateLimit(int maxPerWindow, int windowMinutes) {}
}
