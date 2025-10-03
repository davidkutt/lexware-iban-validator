package com.example.ibanvalidator.service;

import com.example.ibanvalidator.dto.IbanValidationRequest;
import com.example.ibanvalidator.dto.IbanValidationResponse;
import com.example.ibanvalidator.model.Bank;
import com.example.ibanvalidator.repository.BankRepository;
import org.apache.commons.validator.routines.IBANValidator;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IbanService {

    private final BankRepository bankRepository;
    private final IBANValidator ibanValidator;

    public IbanService(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
        this.ibanValidator = IBANValidator.getInstance();
    }

    public IbanValidationResponse validateIban(IbanValidationRequest request) {
        if (request.getIban() == null || request.getIban().isBlank()) {
            return new IbanValidationResponse(false, "IBAN ist erforderlich");
        }

        String iban = normalizeIban(request.getIban());

        if (iban.length() < 15) {
            return new IbanValidationResponse(false, "IBAN zu kurz (Mindestens 15 Zeichen)");
        }

        if (iban.length() > 34) {
            return new IbanValidationResponse(false, "IBAN zu lang (Maximal 34 Zeichen)");
        }

        if (!iban.matches("^[A-Z0-9]+$")) {
            return new IbanValidationResponse(false, "IBAN enthält ungültige Zeichen");
        }

        if (!ibanValidator.isValid(iban)) {
            String countryCode = iban.substring(0, 2);

            if (ibanValidator.getValidator(countryCode) == null) {
                return new IbanValidationResponse(false,
                    "Nicht unterstützter Ländercode: " + countryCode);
            }

            return new IbanValidationResponse(false,
                "Ungültige IBAN (Länge, Format oder Prüfziffer falsch)");
        }

        String countryCode = iban.substring(0, 2);
        String checkDigits = iban.substring(2, 4);

        String bankIdentifier = extractBankIdentifier(iban, countryCode);
        String accountNumber = extractAccountNumber(iban, countryCode);

        Optional<Bank> bank = bankRepository.findByBankCodeAndCountryCode(bankIdentifier, countryCode);

        IbanValidationResponse response = new IbanValidationResponse();
        response.setValid(true);
        response.setIban(iban);
        response.setCountryCode(countryCode);
        response.setCheckDigits(checkDigits);
        response.setBankCode(bankIdentifier);
        response.setAccountNumber(accountNumber);
        bank.ifPresent(response::setBank);

        return response;
    }

    private String normalizeIban(String iban) {
        if (iban == null) {
            return "";
        }

        StringBuilder normalized = new StringBuilder(iban.length());
        for (int i = 0; i < iban.length(); i++) {
            char c = iban.charAt(i);
            if (c == ' ' || c == '-') {
                continue;
            }
            if (c >= 'a' && c <= 'z') {
                normalized.append((char) (c - 32));
            } else {
                normalized.append(c);
            }
        }
        return normalized.toString();
    }

    private String extractBankIdentifier(String iban, String countryCode) {
        try {
            switch (countryCode) {
                case "DE":
                    return iban.substring(4, 12);
                case "AT":
                    return iban.substring(4, 9);
                case "CH":
                    return iban.substring(4, 9);
                case "GB":
                    return iban.substring(4, 10);
                case "FR":
                    return iban.substring(4, 9);
                case "NL":
                    return iban.substring(4, 8);
                case "BE":
                    return iban.substring(4, 7);
                case "ES":
                    return iban.substring(4, 12);
                case "IT":
                    return iban.substring(5, 10);
                default:
                    return iban.length() > 8 ? iban.substring(4, 8) : "";
            }
        } catch (StringIndexOutOfBoundsException e) {
            return "";
        }
    }

    private String extractAccountNumber(String iban, String countryCode) {
        try {
            switch (countryCode) {
                case "DE":
                    return iban.substring(12);
                case "AT":
                    return iban.substring(9);
                case "CH":
                    return iban.substring(9);
                case "GB":
                    return iban.substring(10);
                case "FR":
                    return iban.substring(9);
                case "NL":
                    return iban.substring(8);
                case "BE":
                    return iban.substring(7);
                case "ES":
                    return iban.substring(12);
                case "IT":
                    return iban.substring(15);
                default:
                    return iban.length() > 8 ? iban.substring(8) : "";
            }
        } catch (StringIndexOutOfBoundsException e) {
            return "";
        }
    }
}