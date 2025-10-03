package com.example.ibanvalidator.repository;

import com.example.ibanvalidator.model.Bank;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class BankRepositoryTest {

    @Autowired
    private BankRepository bankRepository;

    @Autowired
    private TestEntityManager entityManager;

    @Test
    void shouldSaveBank() {
        Bank bank = new Bank("Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE");

        Bank savedBank = bankRepository.save(bank);

        assertThat(savedBank.getId()).isNotNull();
        assertThat(savedBank.getName()).isEqualTo("Deutsche Bank");
        assertThat(savedBank.getBic()).isEqualTo("DEUTDEFFXXX");
    }

    @Test
    void shouldFindBankByBankCodeAndCountryCode() {
        Bank bank = new Bank("Test Bank", "TESTDE12XXX", "12345678", "DE");
        entityManager.persist(bank);
        entityManager.flush();

        Optional<Bank> found = bankRepository.findByBankCodeAndCountryCode("12345678", "DE");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Test Bank");
        assertThat(found.get().getBic()).isEqualTo("TESTDE12XXX");
    }

    @Test
    void shouldReturnEmptyWhenBankCodeNotFound() {
        Optional<Bank> found = bankRepository.findByBankCodeAndCountryCode("99999999", "DE");

        assertThat(found).isEmpty();
    }

    @Test
    void shouldFindBankByBic() {
        Bank bank = new Bank("Commerzbank", "COBADEFFXXX", "10040000", "DE");
        entityManager.persist(bank);
        entityManager.flush();

        Optional<Bank> found = bankRepository.findByBic("COBADEFFXXX");

        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Commerzbank");
    }

    @Test
    void shouldFindBanksByCountryCode() {
        Bank bank1 = new Bank("Deutsche Bank", "DEUTDEFFXXX", "10070000", "DE");
        Bank bank2 = new Bank("Commerzbank", "COBADEFFXXX", "10040000", "DE");
        Bank bank3 = new Bank("UBS", "UBSWCHZH80A", "00206", "CH");

        entityManager.persist(bank1);
        entityManager.persist(bank2);
        entityManager.persist(bank3);
        entityManager.flush();

        List<Bank> germanBanks = bankRepository.findByCountryCode("DE");

        assertThat(germanBanks).hasSize(2);
        assertThat(germanBanks).extracting(Bank::getCountryCode)
                .containsOnly("DE");
    }

    @Test
    void shouldSearchBanksByNameContaining() {
        Bank bank1 = new Bank("Deutsche Bank AG", "DEUTDEFFXXX", "10070000", "DE");
        Bank bank2 = new Bank("Deutsche Postbank", "PBNKDEFFXXX", "10010010", "DE");
        Bank bank3 = new Bank("Commerzbank", "COBADEFFXXX", "10040000", "DE");

        entityManager.persist(bank1);
        entityManager.persist(bank2);
        entityManager.persist(bank3);
        entityManager.flush();

        List<Bank> found = bankRepository.findByNameContaining("Deutsche");

        assertThat(found).hasSize(2);
        assertThat(found).extracting(Bank::getName)
                .containsExactlyInAnyOrder("Deutsche Bank AG", "Deutsche Postbank");
    }

    @Test
    void shouldSearchBanksCaseInsensitive() {
        Bank bank = new Bank("Commerzbank AG", "COBADEFFXXX", "10040000", "DE");
        entityManager.persist(bank);
        entityManager.flush();

        List<Bank> found = bankRepository.findByNameContaining("commerzbank");

        assertThat(found).hasSize(1);
        assertThat(found.get(0).getName()).isEqualTo("Commerzbank AG");
    }

    @Test
    void shouldReturnEmptyListWhenNameNotFound() {
        List<Bank> found = bankRepository.findByNameContaining("NonExistent");

        assertThat(found).isEmpty();
    }

    @Test
    void shouldFindAllBanks() {
        Bank bank1 = new Bank("Bank 1", "BANK1DEXXX", "10000001", "DE");
        Bank bank2 = new Bank("Bank 2", "BANK2DEXXX", "10000002", "DE");

        entityManager.persist(bank1);
        entityManager.persist(bank2);
        entityManager.flush();

        List<Bank> allBanks = bankRepository.findAll();

        assertThat(allBanks).hasSize(2);
    }

    @Test
    void shouldDeleteBank() {
        Bank bank = new Bank("Delete Me", "DELETEDEXXX", "99999999", "DE");
        bank = entityManager.persist(bank);
        entityManager.flush();
        Long bankId = bank.getId();

        bankRepository.deleteById(bankId);
        entityManager.flush();

        Optional<Bank> deleted = bankRepository.findById(bankId);
        assertThat(deleted).isEmpty();
    }

    @Test
    void shouldEnforceBicUniqueness() {
        Bank bank1 = new Bank("Bank 1", "DUPLICATEXXX", "10000001", "DE");
        entityManager.persist(bank1);
        entityManager.flush();

        Bank bank2 = new Bank("Bank 2", "DUPLICATEXXX", "10000002", "DE");

        org.junit.jupiter.api.Assertions.assertThrows(
                org.springframework.dao.DataIntegrityViolationException.class,
                () -> {
                    entityManager.persist(bank2);
                    entityManager.flush();
                }
        );
    }
}
