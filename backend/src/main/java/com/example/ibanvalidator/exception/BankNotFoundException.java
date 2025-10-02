package com.example.ibanvalidator.exception;

public class BankNotFoundException extends RuntimeException {

    private final Long bankId;

    public BankNotFoundException(Long id) {
        super(String.format("Bank mit ID %d wurde nicht gefunden", id));
        this.bankId = id;
    }

    public BankNotFoundException(String message) {
        super(message);
        this.bankId = null;
    }

    public Long getBankId() {
        return bankId;
    }
}
