package com.example.ibanvalidator.service;

import com.example.ibanvalidator.dto.BankRequest;
import com.example.ibanvalidator.dto.BankResponse;
import com.example.ibanvalidator.exception.BankNotFoundException;
import com.example.ibanvalidator.exception.DuplicateBicException;
import com.example.ibanvalidator.model.Bank;
import com.example.ibanvalidator.repository.BankRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BankService {

    private static final Logger log = LoggerFactory.getLogger(BankService.class);

    private final BankRepository bankRepository;

    public BankService(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
        log.info("BankService initialisiert");
    }

    private List<BankResponse> mapToBankResponses(List<Bank> banks) {
        return banks.stream()
                .map(BankResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BankResponse> getAllBanks() {
        return mapToBankResponses(bankRepository.findAll());
    }

    @Transactional(readOnly = true)
    public BankResponse getBankById(Long id) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new BankNotFoundException(id));
        return BankResponse.fromEntity(bank);
    }

    @Transactional(readOnly = true)
    public Optional<BankResponse> getBankByBic(String bic) {
        return bankRepository.findByBic(bic)
                .map(BankResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<BankResponse> getBanksByCountry(String countryCode) {
        return mapToBankResponses(bankRepository.findByCountryCode(countryCode));
    }

    public BankResponse createBank(BankRequest request) {
        log.debug("Erstelle Bank: Name={}, BIC={}", request.getName(), request.getBic());

        if (bankRepository.findByBic(request.getBic()).isPresent()) {
            log.warn("Bank-Erstellung fehlgeschlagen: BIC {} existiert bereits", request.getBic());
            throw new DuplicateBicException(request.getBic());
        }

        Bank bank = new Bank(
                request.getName(),
                request.getBic(),
                request.getBankCode(),
                request.getCountryCode()
        );

        Bank savedBank = bankRepository.save(bank);
        log.info("Bank erstellt: ID={}, Name={}", savedBank.getId(), savedBank.getName());
        return BankResponse.fromEntity(savedBank);
    }

    public BankResponse updateBank(Long id, BankRequest request) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new BankNotFoundException(id));

        Optional<Bank> existingBankWithBic = bankRepository.findByBic(request.getBic());
        if (existingBankWithBic.isPresent() && !existingBankWithBic.get().getId().equals(id)) {
            throw new DuplicateBicException(request.getBic());
        }

        bank.setName(request.getName());
        bank.setBic(request.getBic());
        bank.setBankCode(request.getBankCode());
        bank.setCountryCode(request.getCountryCode());

        Bank updatedBank = bankRepository.save(bank);
        return BankResponse.fromEntity(updatedBank);
    }

    public void deleteBank(Long id) {
        log.debug("Lösche Bank: ID={}", id);

        if (!bankRepository.existsById(id)) {
            log.warn("Bank-Löschung fehlgeschlagen: Bank mit ID {} nicht gefunden", id);
            throw new BankNotFoundException(id);
        }

        bankRepository.deleteById(id);
        log.info("Bank gelöscht: ID={}", id);
    }

    @Transactional(readOnly = true)
    public Optional<Bank> findByBankCodeAndCountry(String bankCode, String countryCode) {
        return bankRepository.findByBankCodeAndCountryCode(bankCode, countryCode);
    }

    @Transactional(readOnly = true)
    public List<BankResponse> searchBanksByName(String name) {
        return mapToBankResponses(bankRepository.findByNameContaining(name));
    }
}
