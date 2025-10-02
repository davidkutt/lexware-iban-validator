package com.example.ibanvalidator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BankRequest {

    @NotBlank(message = "Bankname ist erforderlich")
    @Size(min = 2, max = 200, message = "Bankname muss zwischen 2 und 200 Zeichen lang sein")
    private String name;

    @NotBlank(message = "BIC ist erforderlich")
    @Size(min = 8, max = 11, message = "BIC muss 8-11 Zeichen lang sein")
    private String bic;

    @NotBlank(message = "Bankleitzahl ist erforderlich")
    @Size(min = 4, max = 20, message = "Bankleitzahl muss zwischen 4 und 20 Zeichen lang sein")
    private String bankCode;

    @NotBlank(message = "Ländercode ist erforderlich")
    @Size(min = 2, max = 2, message = "Ländercode muss genau 2 Zeichen lang sein")
    private String countryCode;

    public BankRequest() {}

    public BankRequest(String name, String bic, String bankCode, String countryCode) {
        this.name = name;
        this.bic = bic;
        this.bankCode = bankCode;
        this.countryCode = countryCode;
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
