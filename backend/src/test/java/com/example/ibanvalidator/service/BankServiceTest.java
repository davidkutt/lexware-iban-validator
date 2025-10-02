package com.example.ibanvalidator.service;

import com.example.ibanvalidator.dto.BankRequest;
import com.example.ibanvalidator.dto.BankResponse;
import com.example.ibanvalidator.exception.BankNotFoundException;
import com.example.ibanvalidator.exception.DuplicateBicException;
import com.example.ibanvalidator.model.Bank;
import com.example.ibanvalidator.repository.BankRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BankServiceTest {

    @Mock
    private BankRepository bankRepository;

    @InjectMocks
    private BankService bankService;

    private Bank testBank;
    private BankRequest bankRequest;

    @BeforeEach
    void setUp() {
        testBank = new Bank("Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE");
        testBank.setId(1L);

        bankRequest = new BankRequest(
                "Deutsche Bank",
                "DEUTDEFFXXX",
                "10070000",
                "DE"
        );
    }

    @Test
    void shouldGetAllBanks() {
        List<Bank> banks = Arrays.asList(
                testBank,
                createBank(2L, "Commerzbank", "COBADEFFXXX", "10040000", "DE")
        );
        when(bankRepository.findAll()).thenReturn(banks);

        List<BankResponse> result = bankService.getAllBanks();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Deutsche Bank");
        assertThat(result.get(1).getName()).isEqualTo("Commerzbank");

        verify(bankRepository, times(1)).findAll();
    }

    @Test
    void shouldGetBankById() {
        when(bankRepository.findById(1L)).thenReturn(Optional.of(testBank));

        BankResponse result = bankService.getBankById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Deutsche Bank");
        assertThat(result.getBic()).isEqualTo("DEUTDEFFXXX");

        verify(bankRepository, times(1)).findById(1L);
    }

    @Test
    void shouldThrowExceptionWhenBankNotFound() {
        when(bankRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bankService.getBankById(999L))
                .isInstanceOf(BankNotFoundException.class)
                .hasMessageContaining("999");

        verify(bankRepository, times(1)).findById(999L);
    }

    @Test
    void shouldCreateBank() {
        when(bankRepository.findByBic("DEUTDEFFXXX")).thenReturn(Optional.empty());
        when(bankRepository.save(any(Bank.class))).thenReturn(testBank);

        BankResponse result = bankService.createBank(bankRequest);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Deutsche Bank");
        assertThat(result.getBic()).isEqualTo("DEUTDEFFXXX");

        verify(bankRepository, times(1)).findByBic("DEUTDEFFXXX");
        verify(bankRepository, times(1)).save(any(Bank.class));
    }

    @Test
    void shouldThrowExceptionWhenCreatingBankWithDuplicateBic() {
        when(bankRepository.findByBic("DEUTDEFFXXX")).thenReturn(Optional.of(testBank));

        assertThatThrownBy(() -> bankService.createBank(bankRequest))
                .isInstanceOf(DuplicateBicException.class)
                .hasMessageContaining("DEUTDEFFXXX");

        verify(bankRepository, times(1)).findByBic("DEUTDEFFXXX");
        verify(bankRepository, never()).save(any(Bank.class));
    }

    @Test
    void shouldUpdateBank() {
        BankRequest updateRequest = new BankRequest(
                "Deutsche Bank AG (updated)",
                "DEUTDEFFXXX",
                "10070000",
                "DE"
        );

        Bank updatedBank = new Bank("Deutsche Bank AG (updated)", "DEUTDEFFXXX", "10070000", "DE");
        updatedBank.setId(1L);

        when(bankRepository.findById(1L)).thenReturn(Optional.of(testBank));
        when(bankRepository.findByBic("DEUTDEFFXXX")).thenReturn(Optional.of(testBank));
        when(bankRepository.save(any(Bank.class))).thenReturn(updatedBank);

        BankResponse result = bankService.updateBank(1L, updateRequest);

        assertThat(result).isNotNull();
        assertThat(result.getName()).isEqualTo("Deutsche Bank AG (updated)");

        verify(bankRepository, times(1)).findById(1L);
        verify(bankRepository, times(1)).save(any(Bank.class));
    }

    @Test
    void shouldThrowExceptionWhenUpdatingNonExistentBank() {
        when(bankRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bankService.updateBank(999L, bankRequest))
                .isInstanceOf(BankNotFoundException.class);

        verify(bankRepository, times(1)).findById(999L);
        verify(bankRepository, never()).save(any(Bank.class));
    }

    @Test
    void shouldThrowExceptionWhenUpdatingWithDuplicateBic() {

        Bank anotherBank = createBank(2L, "Another Bank", "OTHERBICXXX", "10000000", "DE");

        BankRequest updateRequest = new BankRequest(
                "Deutsche Bank",
                "OTHERBICXXX",
                "10070000",
                "DE"
        );

        when(bankRepository.findById(1L)).thenReturn(Optional.of(testBank));
        when(bankRepository.findByBic("OTHERBICXXX")).thenReturn(Optional.of(anotherBank));

        assertThatThrownBy(() -> bankService.updateBank(1L, updateRequest))
                .isInstanceOf(DuplicateBicException.class)
                .hasMessageContaining("OTHERBICXXX");

        verify(bankRepository, times(1)).findById(1L);
        verify(bankRepository, never()).save(any(Bank.class));
    }

    @Test
    void shouldDeleteBank() {
        when(bankRepository.findById(1L)).thenReturn(Optional.of(testBank));
        doNothing().when(bankRepository).delete(any(Bank.class));

        bankService.deleteBank(1L);

        verify(bankRepository, times(1)).findById(1L);
        verify(bankRepository, times(1)).delete(testBank);
    }

    @Test
    void shouldThrowExceptionWhenDeletingNonExistentBank() {
        when(bankRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> bankService.deleteBank(999L))
                .isInstanceOf(BankNotFoundException.class);

        verify(bankRepository, times(1)).findById(999L);
        verify(bankRepository, never()).delete(any(Bank.class));
    }

    @Test
    void shouldGetBanksByCountryCode() {
        List<Bank> germanBanks = Arrays.asList(testBank);
        when(bankRepository.findByCountryCode("DE")).thenReturn(germanBanks);

        List<BankResponse> result = bankService.getBanksByCountry("DE");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCountryCode()).isEqualTo("DE");

        verify(bankRepository, times(1)).findByCountryCode("DE");
    }

    @Test
    void shouldSearchBanksByName() {
        List<Bank> banks = Arrays.asList(testBank);
        when(bankRepository.findByNameContaining("Deutsche")).thenReturn(banks);

        List<BankResponse> result = bankService.searchBanksByName("Deutsche");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).contains("Deutsche");

        verify(bankRepository, times(1)).findByNameContaining("Deutsche");
    }

    private Bank createBank(Long id, String name, String bic, String bankCode, String countryCode) {
        Bank bank = new Bank(name, bic, bankCode, countryCode);
        bank.setId(id);
        return bank;
    }
}
