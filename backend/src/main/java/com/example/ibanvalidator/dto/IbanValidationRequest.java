package com.example.ibanvalidator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class IbanValidationRequest {

    @NotBlank(message = "IBAN ist erforderlich")
    @Pattern(regexp = "^[A-Z]{2}[0-9]{2}[A-Z0-9\\s-]*$",
            message = "Ungültiges IBAN-Format")
    private String iban;

    public IbanValidationRequest() {}

    public IbanValidationRequest(String iban) {
        this.iban = iban;
    }

    public String getIban() {
        return iban;
    }
    public void setIban(String iban) {
        this.iban = iban;
    }
}