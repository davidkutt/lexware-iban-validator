package com.example.ibanvalidator.service;

import com.example.ibanvalidator.dto.IbanValidationRequest;
import com.example.ibanvalidator.dto.IbanValidationResponse;
import com.example.ibanvalidator.model.Bank;
import com.example.ibanvalidator.repository.BankRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IbanServiceTest {

    @Mock
    private BankRepository bankRepository;

    @InjectMocks
    private IbanService ibanService;

    private Bank testBank;

    @BeforeEach
    void setUp() {
        testBank = new Bank("Deutsche Bank", "DEUTDEFFXXX", "37040044", "DE");
        testBank.setId(1L);
    }

    @Test
    void shouldValidateCorrectGermanIban() {
        
        String validIban = "DE89370400440532013000";
        IbanValidationRequest request = new IbanValidationRequest(validIban);

        when(bankRepository.findByBankCodeAndCountryCode("37040044", "DE"))
                .thenReturn(Optional.of(testBank));

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isTrue();
        assertThat(response.getIban()).isEqualTo("DE89370400440532013000");
        assertThat(response.getCountryCode()).isEqualTo("DE");
        assertThat(response.getCheckDigits()).isEqualTo("89");
        assertThat(response.getBankCode()).isEqualTo("37040044");
        assertThat(response.getAccountNumber()).isEqualTo("0532013000");
        assertThat(response.getBank()).isNotNull();
        assertThat(response.getBank().getName()).isEqualTo("Deutsche Bank");

        verify(bankRepository, times(1)).findByBankCodeAndCountryCode("37040044", "DE");
    }

    @Test
    void shouldValidateIbanWithSpaces() {
        
        String ibanWithSpaces = "DE89 3704 0044 0532 0130 00";
        IbanValidationRequest request = new IbanValidationRequest(ibanWithSpaces);

        when(bankRepository.findByBankCodeAndCountryCode("37040044", "DE"))
                .thenReturn(Optional.of(testBank));

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isTrue();
        assertThat(response.getIban()).isEqualTo("DE89370400440532013000");
    }

    @Test
    void shouldValidateIbanWithDashes() {
        
        String ibanWithDashes = "DE89-3704-0044-0532-0130-00";
        IbanValidationRequest request = new IbanValidationRequest(ibanWithDashes);

        when(bankRepository.findByBankCodeAndCountryCode("37040044", "DE"))
                .thenReturn(Optional.of(testBank));

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isTrue();
    }

    @Test
    void shouldRejectIbanWithInvalidCheckDigits() {
        String invalidIban = "DE00370400440532013000";
        IbanValidationRequest request = new IbanValidationRequest(invalidIban);

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isFalse();
        assertThat(response.getErrorMessage()).contains("Ungültige");

        verify(bankRepository, never()).findByBankCodeAndCountryCode(anyString(), anyString());
    }

    @Test
    void shouldRejectTooShortIban() {
        
        String shortIban = "DE89370";
        IbanValidationRequest request = new IbanValidationRequest(shortIban);

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isFalse();
        assertThat(response.getErrorMessage()).containsAnyOf("zu kurz", "Mindestens");
    }

    @Test
    void shouldRejectTooLongIban() {
        
        String longIban = "DE89370400440532013000123456789012345";
        IbanValidationRequest request = new IbanValidationRequest(longIban);

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isFalse();
        assertThat(response.getErrorMessage()).containsAnyOf("zu lang", "Maximal");
    }

    @Test
    void shouldRejectIbanWithInvalidCharacters() {
        
        String invalidIban = "DE89@370400440532013000";
        IbanValidationRequest request = new IbanValidationRequest(invalidIban);

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isFalse();
        assertThat(response.getErrorMessage()).contains("ungültige Zeichen");
    }

    @Test
    void shouldRejectUnsupportedCountryCode() {
        String invalidIban = "XX89370400440532013000";
        IbanValidationRequest request = new IbanValidationRequest(invalidIban);

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isFalse();
        assertThat(response.getErrorMessage()).contains("Nicht unterstützter Ländercode");
    }

    @Test
    void shouldValidateCorrectGBIban() {
        
        String validGbIban = "GB29NWBK60161331926819";
        IbanValidationRequest request = new IbanValidationRequest(validGbIban);

        Bank ukBank = new Bank("NatWest", "NWBKGB2L", "601613", "GB");
        when(bankRepository.findByBankCodeAndCountryCode("601613", "GB"))
                .thenReturn(Optional.of(ukBank));

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isTrue();
        assertThat(response.getCountryCode()).isEqualTo("GB");
        assertThat(response.getCheckDigits()).isEqualTo("29");
    }

    @Test
    void shouldHandleNullIban() {
        
        IbanValidationRequest request = new IbanValidationRequest(null);

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isFalse();
        assertThat(response.getErrorMessage()).contains("erforderlich");
    }

    @Test
    void shouldHandleEmptyIban() {
        
        IbanValidationRequest request = new IbanValidationRequest("");

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isFalse();
        assertThat(response.getErrorMessage()).contains("erforderlich");
    }

    @Test
    void shouldValidateIbanWithoutBankInDatabase() {
        
        String validIban = "DE89370400440532013000";
        IbanValidationRequest request = new IbanValidationRequest(validIban);

        when(bankRepository.findByBankCodeAndCountryCode("37040044", "DE"))
                .thenReturn(Optional.empty());

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isTrue();
        assertThat(response.getBank()).isNull();
        assertThat(response.getBankCode()).isEqualTo("37040044");
    }

    @Test
    void shouldConvertLowercaseIbanToUppercase() {
        
        String lowercaseIban = "de89370400440532013000";
        IbanValidationRequest request = new IbanValidationRequest(lowercaseIban);

        when(bankRepository.findByBankCodeAndCountryCode("37040044", "DE"))
                .thenReturn(Optional.of(testBank));

        
        IbanValidationResponse response = ibanService.validateIban(request);

        
        assertThat(response.isValid()).isTrue();
        assertThat(response.getIban()).isEqualTo("DE89370400440532013000");
        assertThat(response.getCountryCode()).isEqualTo("DE");
    }
}
