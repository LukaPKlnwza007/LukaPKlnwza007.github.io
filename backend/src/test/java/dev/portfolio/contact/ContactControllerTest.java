package dev.portfolio.contact;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration tests for /api/contact, covering the paths a real visitor (or a
 * real bot) can reach.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ContactControllerTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ContactRepository repository;

    @BeforeEach
    void clearTable() {
        repository.deleteAll();
    }

    @Test
    @DisplayName("valid submission is accepted and stored")
    void acceptsValidSubmission() throws Exception {
        String body = """
                {
                  "name": "Ada Lovelace",
                  "email": "ada@example.com",
                  "subject": "Dispatch board",
                  "message": "We run 20 vehicles and track them in a spreadsheet. Help."
                }
                """;

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(body))
           .andExpect(status().isCreated())
           .andExpect(jsonPath("$.message").exists())
           .andExpect(jsonPath("$.id").isNumber());

        assertThat(repository.count()).isEqualTo(1);
        assertThat(repository.findAll().get(0).getEmail()).isEqualTo("ada@example.com");
    }

    @Test
    @DisplayName("malformed email is rejected and names the field")
    void rejectsInvalidEmail() throws Exception {
        String body = """
                {
                  "name": "Ada",
                  "email": "not-an-address",
                  "message": "Long enough to clear the minimum length rule."
                }
                """;

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(body))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.errors.email").exists());

        assertThat(repository.count()).isZero();
    }

    @Test
    @DisplayName("message under 10 characters is rejected")
    void rejectsShortMessage() throws Exception {
        String body = """
                {
                  "name": "Ada",
                  "email": "ada@example.com",
                  "message": "hi"
                }
                """;

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(body))
           .andExpect(status().isBadRequest())
           .andExpect(jsonPath("$.errors.message").exists());
    }

    @Test
    @DisplayName("honeypot submission looks successful but stores nothing")
    void silentlyDropsBotSubmission() throws Exception {
        String body = """
                {
                  "name": "Bot",
                  "email": "bot@example.com",
                  "message": "buy cheap things now visit our website today please",
                  "website": "http://spam.example"
                }
                """;

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(body))
           .andExpect(status().isOk());

        // The point of this test: no new row.
        assertThat(repository.count()).isZero();
    }

    @Test
    @DisplayName("health check answers ok")
    void healthReturnsOk() throws Exception {
        mvc.perform(get("/api/contact/health"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.status").value("ok"));
    }
}
