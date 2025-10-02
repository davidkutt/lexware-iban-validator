package com.example.ibanvalidator.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "banks")
public class Bank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Bankname ist erforderlich")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "BIC ist erforderlich")
    @Size(min = 8, max = 11, message = "BIC muss 8-11 Zeichen lang sein")
    @Column(nullable = false, unique = true)
    private String bic;

    @NotBlank(message = "Bankleitzahl ist erforderlich")
    @Column(name = "bank_code", nullable = false)
    private String bankCode;

    @NotBlank(message = "Ländercode ist erforderlich")
    @Size(min = 2, max = 2, message = "Ländercode muss 2 Zeichen lang sein")
    @Column(nullable = false)
    private String countryCode;

    public Bank() {
    }

    public Bank(String name, String bic, String bankCode, String countryCode) {
        this.name = name;
        this.bic = bic;
        this.bankCode = bankCode;
        this.countryCode = countryCode;
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