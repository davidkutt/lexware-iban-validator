package com.example.ibanvalidator.exception;

public class IbanValidationException extends RuntimeException {

    private final String iban;

    public IbanValidationException(String message, String iban) {
        super(message);
        this.iban = iban;
    }

    public IbanValidationException(String message) {
        super(message);
        this.iban = null;
    }

    public String getIban() {
        return iban;
    }
}
