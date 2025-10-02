package com.example.ibanvalidator.dto;

import com.example.ibanvalidator.model.Bank;

public class BankResponse {

    private Long id;
    private String name;
    private String bic;
    private String bankCode;
    private String countryCode;

    public BankResponse() {}

    public BankResponse(Long id, String name, String bic, String bankCode, String countryCode) {
        this.id = id;
        this.name = name;
        this.bic = bic;
        this.bankCode = bankCode;
        this.countryCode = countryCode;
    }

    public static BankResponse fromEntity(Bank bank) {
        return new BankResponse(
                bank.getId(),
                bank.getName(),
                bank.getBic(),
                bank.getBankCode(),
                bank.getCountryCode()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBic() {
        return bic;
    }

    public void setBic(String bic) {
        this.bic = bic;
    }

    public String getBankCode() {
        return bankCode;
    }

    public void setBankCode(String bankCode) {
        this.bankCode = bankCode;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }
}
