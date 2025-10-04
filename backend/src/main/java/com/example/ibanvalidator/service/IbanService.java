package com.example.ibanvalidator.service;

import com.example.ibanvalidator.config.IbanCountryConfig;
import com.example.ibanvalidator.config.IbanCountryConfig.CountryFormat;
import com.example.ibanvalidator.constants.IbanConstants;
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

        if (iban.length() < IbanConstants.MIN_IBAN_LENGTH) {
            return new IbanValidationResponse(false,
                "IBAN zu kurz (Mindestens " + IbanConstants.MIN_IBAN_LENGTH + " Zeichen)");
        }

        if (iban.length() > IbanConstants.MAX_IBAN_LENGTH) {
            return new IbanValidationResponse(false,
                "IBAN zu lang (Maximal " + IbanConstants.MAX_IBAN_LENGTH + " Zeichen)");
        }

        if (!iban.matches(IbanConstants.IBAN_VALID_CHARS_REGEX)) {
            return new IbanValidationResponse(false, "IBAN enthält ungültige Zeichen");
        }

        if (!ibanValidator.isValid(iban)) {
            String countryCode = iban.substring(
                IbanConstants.COUNTRY_CODE_START,
                IbanConstants.COUNTRY_CODE_END
            );

            if (ibanValidator.getValidator(countryCode) == null) {
                return new IbanValidationResponse(false,
                    "Nicht unterstützter Ländercode: " + countryCode);
            }

            return new IbanValidationResponse(false,
                "Ungültige IBAN (Länge, Format oder Prüfziffer falsch)");
        }

        String countryCode = iban.substring(
            IbanConstants.COUNTRY_CODE_START,
            IbanConstants.COUNTRY_CODE_END
        );
        String checkDigits = iban.substring(
            IbanConstants.CHECK_DIGITS_START,
            IbanConstants.CHECK_DIGITS_END
        );

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
            if (c == IbanConstants.SPACE || c == IbanConstants.HYPHEN) {
                continue;
            }
            if (c >= 'a' && c <= 'z') {
                normalized.append((char) (c - IbanConstants.LOWERCASE_TO_UPPERCASE_OFFSET));
            } else {
                normalized.append(c);
            }
        }
        return normalized.toString();
    }

    private String extractBankIdentifier(String iban, String countryCode) {
        try {
            CountryFormat format = IbanCountryConfig.getFormat(countryCode);
            return iban.substring(format.bankCodeStart(), format.bankCodeEnd());
        } catch (StringIndexOutOfBoundsException e) {
            return "";
        }
    }

    private String extractAccountNumber(String iban, String countryCode) {
        try {
            CountryFormat format = IbanCountryConfig.getFormat(countryCode);
            return iban.substring(format.accountNumberStart());
        } catch (StringIndexOutOfBoundsException e) {
            return "";
        }
    }
}