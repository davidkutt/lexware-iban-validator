package com.example.ibanvalidator.repository;

import com.example.ibanvalidator.model.Bank;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Repository Tests für BankRepository
 * Verwendet @DataJpaTest für schnelle, isolierte DB-Tests mit H2
 */
@DataJpaTest
class BankRepositoryTest {

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void shouldSaveBank() {
        // Given
        Bank bank = new Bank("Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE");

        // When
        Bank savedBank = bankRepository.save(bank);

        // Then
        assertThat(savedBank.getId()).isNotNull();
        assertThat(savedBank.getName()).isEqualTo("Deutsche Bank");
        assertThat(savedBank.getBic()).isEqualTo("DEUTDEFFXXX");
    }

    @Test
    void shouldFindBankByBankCodeAndCountryCode() {
        // Given
        Bank bank = new Bank("Test Bank", "TESTDE12XXX", "12345678", "DE");
        entityManager.persist(bank);
        entityManager.flush();

        // When
        Optional<Bank> found = bankRepository.findByBankCodeAndCountryCode("12345678", "DE");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test Bank");
        assertThat(found.get().getBic()).isEqualTo("TESTDE12XXX");
    }

    @Test
    void shouldReturnEmptyWhenBankCodeNotFound() {
        // When
        Optional<Bank> found = bankRepository.findByBankCodeAndCountryCode("99999999", "DE");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    void shouldFindBankByBic() {
        // Given
        Bank bank = new Bank("Commerzbank", "COBADEFFXXX", "10040000", "DE");
        entityManager.persist(bank);
        entityManager.flush();

        // When
        Optional<Bank> found = bankRepository.findByBic("COBADEFFXXX");

        // Then
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Commerzbank");
    }

    @Test
    void shouldFindBanksByCountryCode() {
        // Given
        Bank bank1 = new Bank("Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE");
        Bank bank2 = new Bank("Commerzbank", "COBADEFFXXX", "10040000", "DE");
        Bank bank3 = new Bank("UBS", "UBSWCHZH80A", "00206", "CH");

        entityManager.persist(bank1);
        entityManager.persist(bank2);
        entityManager.persist(bank3);
        entityManager.flush();

        // When
        List<Bank> germanBanks = bankRepository.findByCountryCode("DE");

        // Then
        assertThat(germanBanks).hasSize(2);
        assertThat(germanBanks).extracting(Bank::getCountryCode)
                .containsOnly("DE");
    }

    @Test
    void shouldSearchBanksByNameContaining() {
        // Given
        Bank bank1 = new Bank("Deutsche Bank AG", "DEUTDEFFXXX", "10070000", "DE");
        Bank bank2 = new Bank("Deutsche Postbank", "PBNKDEFFXXX", "10010010", "DE");
        Bank bank3 = new Bank("Commerzbank", "COBADEFFXXX", "10040000", "DE");

        entityManager.persist(bank1);
        entityManager.persist(bank2);
        entityManager.persist(bank3);
        entityManager.flush();

        // When
        List<Bank> found = bankRepository.findByNameContaining("Deutsche");

        // Then
        assertThat(found).hasSize(2);
        assertThat(found).extracting(Bank::getName)
                .containsExactlyInAnyOrder("Deutsche Bank AG", "Deutsche Postbank");
    }

    @Test
    void shouldSearchBanksCaseInsensitive() {
        // Given
        Bank bank = new Bank("Commerzbank AG", "COBADEFFXXX", "10040000", "DE");
        entityManager.persist(bank);
        entityManager.flush();

        // When
        List<Bank> found = bankRepository.findByNameContaining("commerzbank");

        // Then
        assertThat(found).hasSize(1);
        assertThat(found.get(0).getName()).isEqualTo("Commerzbank AG");
    }

    @Test
    void shouldReturnEmptyListWhenNameNotFound() {
        // When
        List<Bank> found = bankRepository.findByNameContaining("NonExistent");

        // Then
        assertThat(found).isEmpty();
    }

    @Test
    void shouldFindAllBanks() {
        // Given
        Bank bank1 = new Bank("Bank 1", "BANK1DEXXX", "10000001", "DE");
        Bank bank2 = new Bank("Bank 2", "BANK2DEXXX", "10000002", "DE");

        entityManager.persist(bank1);
        entityManager.persist(bank2);
        entityManager.flush();

        // When
        List<Bank> allBanks = bankRepository.findAll();

        // Then
        assertThat(allBanks).hasSize(2);
    }

    @Test
    void shouldDeleteBank() {
        // Given
        Bank bank = new Bank("Delete Me", "DELETEDEXXX", "99999999", "DE");
        bank = entityManager.persist(bank);
        entityManager.flush();
        Long bankId = bank.getId();

        // When
        bankRepository.deleteById(bankId);
        entityManager.flush();

        // Then
        Optional<Bank> deleted = bankRepository.findById(bankId);
        assertThat(deleted).isEmpty();
    }

    @Test
    void shouldEnforceBicUniqueness() {
        // Given
        Bank bank1 = new Bank("Bank 1", "DUPLICATEXXX", "10000001", "DE");
        entityManager.persist(bank1);
        entityManager.flush();

        // When & Then
        Bank bank2 = new Bank("Bank 2", "DUPLICATEXXX", "10000002", "DE");

        // Dies sollte fehlschlagen aufgrund der @Column(unique=true) Constraint
        org.junit.jupiter.api.Assertions.assertThrows(
                org.springframework.dao.DataIntegrityViolationException.class,
                () -> {
                    entityManager.persist(bank2);
                    entityManager.flush();
                }
        );
    }
}
