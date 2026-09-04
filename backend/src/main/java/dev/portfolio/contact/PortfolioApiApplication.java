package dev.portfolio.contact;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

/**
 * Entry point for the contact form API.
 *
 * <p>Run it with {@code mvn spring-boot:run}, then hit
 * http://localhost:8080/api/contact/health to confirm it came up.</p>
 */
@SpringBootApplication
@ConfigurationPropertiesScan
public class PortfolioApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortfolioApiApplication.class, args);
    }
}
