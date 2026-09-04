package dev.portfolio.contact;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS, so the static site can call this API.
 *
 * <p>The list comes from contact.cors.origins. In production set the
 * {@code CORS_ORIGINS} environment variable to your own domain and nothing
 * else. Never "*": that lets any site on the internet fire this form on your
 * behalf.</p>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final ContactProperties props;

    public WebConfig(ContactProperties props) {
        this.props = props;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(props.cors().origins().toArray(String[]::new))
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowedHeaders("Content-Type", "Accept")
                .maxAge(3600);
    }
}
