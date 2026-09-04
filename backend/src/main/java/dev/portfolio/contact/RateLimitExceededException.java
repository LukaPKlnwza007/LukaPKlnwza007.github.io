package dev.portfolio.contact;

/**
 * Thrown when one IP sends more than the configured number of messages inside
 * the window. ApiExceptionHandler turns it into a 429.
 */
public class RateLimitExceededException extends RuntimeException {

    public RateLimitExceededException(String message) {
        super(message);
    }
}
