package com.example.ibanvalidator.dto;

import com.example.ibanvalidator.model.Bank;

public class IbanValidationResponse {

    private boolean valid;
    private String iban;
    private String countryCode;
    private String checkDigits;
    private String bankCode;
    private String accountNumber;
    private Bank bank;
    private String errorMessage;

    public IbanValidationResponse() {}

    public IbanValidationResponse(boolean valid, String errorMessage) {
        this.valid = valid;
        this.errorMessage = errorMessage;
    }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getIban() { return iban; }
    public void setIban(String iban) { this.iban = iban; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public String getCheckDigits() { return checkDigits; }
    public void setCheckDigits(String checkDigits) { this.checkDigits = checkDigits; }

    public String getBankCode() { return bankCode; }
    public void setBankCode(String bankCode) { this.bankCode = bankCode; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public Bank getBank() { return bank; }
    public void setBank(Bank bank) { this.bank = bank; }

    public String getErrorMessage() { return errorMessage; }
    public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
}