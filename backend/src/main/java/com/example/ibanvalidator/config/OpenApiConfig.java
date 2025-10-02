package com.example.ibanvalidator.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ibanValidatorOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Development Server");

        Server dockerServer = new Server();
        dockerServer.setUrl("http://localhost:8080");
        dockerServer.setDescription("Docker Environment");

        Contact contact = new Contact();
        contact.setName("IBAN Validator Team");
        contact.setEmail("support@iban-validator.com");

        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info info = new Info()
                .title("IBAN Validator API")
                .version("1.0.0")
                .contact(contact)
                .description("REST API for IBAN validation and bank management. " +
                        "Implements ISO 13616 standard for IBAN validation using MOD-97 algorithm.")
                .license(license);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, dockerServer));
    }
}
