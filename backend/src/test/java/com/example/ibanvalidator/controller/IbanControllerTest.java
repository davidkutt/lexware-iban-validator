package com.example.ibanvalidator.controller;

import com.example.ibanvalidator.dto.BankRequest;
import com.example.ibanvalidator.dto.BankResponse;
import com.example.ibanvalidator.dto.IbanValidationRequest;
import com.example.ibanvalidator.dto.IbanValidationResponse;
import com.example.ibanvalidator.exception.BankNotFoundException;
import com.example.ibanvalidator.exception.DuplicateBicException;
import com.example.ibanvalidator.service.BankService;
import com.example.ibanvalidator.service.IbanService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Controller Integration Tests für IbanController
 * Verwendet @WebMvcTest für schnelle, fokussierte Controller-Tests
 */
@WebMvcTest(IbanController.class)
class IbanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IbanService ibanService;

    @MockBean
    private BankService bankService;

    @Test
    void shouldValidateIban() throws Exception {
        // Given
        IbanValidationRequest request = new IbanValidationRequest("DE89370400440532013000");

        IbanValidationResponse response = new IbanValidationResponse();
        response.setValid(true);
        response.setIban("DE89370400440532013000");
        response.setCountryCode("DE");
        response.setCheckDigits("89");
        response.setBankCode("37040044");
        response.setAccountNumber("0532013000");

        when(ibanService.validateIban(any(IbanValidationRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/v1/iban/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.iban").value("DE89370400440532013000"))
                .andExpect(jsonPath("$.countryCode").value("DE"))
                .andExpect(jsonPath("$.checkDigits").value("89"))
                .andExpect(jsonPath("$.bankCode").value("37040044"));

        verify(ibanService, times(1)).validateIban(any(IbanValidationRequest.class));
    }

    @Test
    void shouldReturnBadRequestForInvalidIban() throws Exception {
        // Given - IBAN leer
        IbanValidationRequest request = new IbanValidationRequest("");

        // When & Then
        mockMvc.perform(post("/api/v1/iban/validate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors").exists());
    }

    @Test
    void shouldGetAllBanks() throws Exception {
        // Given
        List<BankResponse> banks = Arrays.asList(
                new BankResponse(1L, "Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE"),
                new BankResponse(2L, "Commerzbank", "COBADEFFXXX", "10040000", "DE")
        );

        when(bankService.getAllBanks()).thenReturn(banks);

        // When & Then
        mockMvc.perform(get("/api/v1/banks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Deutsche Bank"))
                .andExpect(jsonPath("$[1].name").value("Commerzbank"));

        verify(bankService, times(1)).getAllBanks();
    }

    @Test
    void shouldGetBankById() throws Exception {
        // Given
        BankResponse bank = new BankResponse(1L, "Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE");
        when(bankService.getBankById(1L)).thenReturn(bank);

        // When & Then
        mockMvc.perform(get("/api/v1/banks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Deutsche Bank"))
                .andExpect(jsonPath("$.bic").value("DEUTDEFFXXX"));

        verify(bankService, times(1)).getBankById(1L);
    }

    @Test
    void shouldReturn404WhenBankNotFound() throws Exception {
        // Given
        when(bankService.getBankById(999L)).thenThrow(new BankNotFoundException(999L));

        // When & Then
        mockMvc.perform(get("/api/v1/banks/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(containsString("999")));

        verify(bankService, times(1)).getBankById(999L);
    }

    @Test
    void shouldCreateBank() throws Exception {
        // Given
        BankRequest request = new BankRequest("Test Bank", "TESTDE12XXX", "12345678", "DE");
        BankResponse response = new BankResponse(1L, "Test Bank", "TESTDE12XXX", "12345678", "DE");

        when(bankService.createBank(any(BankRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(post("/api/v1/banks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Test Bank"))
                .andExpect(jsonPath("$.bic").value("TESTDE12XXX"));

        verify(bankService, times(1)).createBank(any(BankRequest.class));
    }

    @Test
    void shouldReturn409WhenCreatingBankWithDuplicateBic() throws Exception {
        // Given
        BankRequest request = new BankRequest("Test Bank", "DEUTDEFFXXX", "12345678", "DE");

        when(bankService.createBank(any(BankRequest.class)))
                .thenThrow(new DuplicateBicException("DEUTDEFFXXX"));

        // When & Then
        mockMvc.perform(post("/api/v1/banks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value(containsString("DEUTDEFFXXX")));

        verify(bankService, times(1)).createBank(any(BankRequest.class));
    }

    @Test
    void shouldValidateRequiredFieldsWhenCreatingBank() throws Exception {
        // Given - Request mit fehlenden Pflichtfeldern
        BankRequest request = new BankRequest("", "", "", "");

        // When & Then
        mockMvc.perform(post("/api/v1/banks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.validationErrors", hasSize(greaterThan(0))));

        verify(bankService, never()).createBank(any(BankRequest.class));
    }

    @Test
    void shouldUpdateBank() throws Exception {
        // Given
        BankRequest request = new BankRequest("Updated Bank", "TESTDE12XXX", "12345678", "DE");
        BankResponse response = new BankResponse(1L, "Updated Bank", "TESTDE12XXX", "12345678", "DE");

        when(bankService.updateBank(eq(1L), any(BankRequest.class))).thenReturn(response);

        // When & Then
        mockMvc.perform(put("/api/v1/banks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Bank"));

        verify(bankService, times(1)).updateBank(eq(1L), any(BankRequest.class));
    }

    @Test
    void shouldDeleteBank() throws Exception {
        // Given
        doNothing().when(bankService).deleteBank(1L);

        // When & Then
        mockMvc.perform(delete("/api/v1/banks/1"))
                .andExpect(status().isNoContent());

        verify(bankService, times(1)).deleteBank(1L);
    }

    @Test
    void shouldGetBanksByCountryCode() throws Exception {
        // Given
        List<BankResponse> banks = Arrays.asList(
                new BankResponse(1L, "Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE")
        );

        when(bankService.getBanksByCountry("DE")).thenReturn(banks);

        // When & Then
        mockMvc.perform(get("/api/v1/banks/country/DE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].countryCode").value("DE"));

        verify(bankService, times(1)).getBanksByCountry("DE");
    }

    @Test
    void shouldSearchBanksByName() throws Exception {
        // Given
        List<BankResponse> banks = Arrays.asList(
                new BankResponse(1L, "Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE"),
                new BankResponse(2L, "Deutsche Postbank", "PBNKDEFFXXX", "10010010", "DE")
        );

        when(bankService.searchBanksByName("Deutsche")).thenReturn(banks);

        // When & Then
        mockMvc.perform(get("/api/v1/banks/search")
                        .param("name", "Deutsche"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].name", everyItem(containsString("Deutsche"))));

        verify(bankService, times(1)).searchBanksByName("Deutsche");
    }
}
