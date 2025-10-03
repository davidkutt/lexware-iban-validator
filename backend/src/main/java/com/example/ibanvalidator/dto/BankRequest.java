package com.example.ibanvalidator.dto;

import com.example.ibanvalidator.constants.ValidationConstants;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BankRequest {

    @NotBlank(message = "Bankname ist erforderlich")
    @Size(
        min = ValidationConstants.BANK_NAME_MIN_LENGTH,
        max = ValidationConstants.BANK_NAME_MAX_LENGTH,
        message = "Bankname muss zwischen " + ValidationConstants.BANK_NAME_MIN_LENGTH +
                  " und " + ValidationConstants.BANK_NAME_MAX_LENGTH + " Zeichen lang sein"
    )
    private String name;

    @NotBlank(message = "BIC ist erforderlich")
    @Size(
        min = ValidationConstants.BIC_MIN_LENGTH,
        max = ValidationConstants.BIC_MAX_LENGTH,
        message = "BIC muss " + ValidationConstants.BIC_MIN_LENGTH + "-" +
                  ValidationConstants.BIC_MAX_LENGTH + " Zeichen lang sein"
    )
    private String bic;

    @NotBlank(message = "Bankleitzahl ist erforderlich")
    @Size(
        min = ValidationConstants.BANK_CODE_MIN_LENGTH,
        max = ValidationConstants.BANK_CODE_MAX_LENGTH,
        message = "Bankleitzahl muss zwischen " + ValidationConstants.BANK_CODE_MIN_LENGTH +
                  " und " + ValidationConstants.BANK_CODE_MAX_LENGTH + " Zeichen lang sein"
    )
    private String bankCode;

    @NotBlank(message = "Ländercode ist erforderlich")
    @Size(
        min = ValidationConstants.COUNTRY_CODE_LENGTH,
        max = ValidationConstants.COUNTRY_CODE_LENGTH,
        message = "Ländercode muss genau " + ValidationConstants.COUNTRY_CODE_LENGTH + " Zeichen lang sein"
    )
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
