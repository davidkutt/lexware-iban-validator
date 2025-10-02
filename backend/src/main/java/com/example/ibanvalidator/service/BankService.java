package com.example.ibanvalidator.service;

import com.example.ibanvalidator.dto.BankRequest;
import com.example.ibanvalidator.dto.BankResponse;
import com.example.ibanvalidator.exception.BankNotFoundException;
import com.example.ibanvalidator.exception.DuplicateBicException;
import com.example.ibanvalidator.model.Bank;
import com.example.ibanvalidator.repository.BankRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BankService {

    private final BankRepository bankRepository;

    public BankService(BankRepository bankRepository) {
        this.bankRepository = bankRepository;
    }

    @Transactional(readOnly = true)
    public List<BankResponse> getAllBanks() {
        return bankRepository.findAll()
                .stream()
                .map(BankResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Bank nach ID abrufen
     * @throws BankNotFoundException wenn Bank nicht existiert
     */
    @Transactional(readOnly = true)
    public BankResponse getBankById(Long id) {
        Bank bank = bankRepository.findById(id)
                .orElseThrow(() -> new BankNotFoundException(id));
        return BankResponse.fromEntity(bank);
    }

    /**
     * Bank nach BIC suchen
     */
    @Transactional(readOnly = true)
    public Optional<BankResponse> getBankByBic(String bic) {
        return bankRepository.findByBic(bic)
                .map(BankResponse::fromEntity);
    }

    /**
     * Banken nach Land abrufen
     */
    @Transactional(readOnly = true)
    public List<BankResponse> getBanksByCountry(String countryCode) {
        return bankRepository.findByCountryCode(countryCode)
                .stream()
                .map(BankResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Neue Bank erstellen
     * @throws DuplicateBicException wenn BIC bereits existiert
     */
    public BankResponse createBank(BankRequest request) {
        if (bankRepository.findByBic(request.getBic()).isPresent()) {
            throw new DuplicateBicException(request.getBic());
        }

        Bank bank = new Bank(
                request.getName(),
                request.getBic(),
                request.getBankCode(),
                request.getCountryCode()
        );

        Bank savedBank = bankRepository.save(bank);
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
        if (!bankRepository.existsById(id)) {
            throw new BankNotFoundException(id);
        }
        bankRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Bank> findByBankCodeAndCountry(String bankCode, String countryCode) {
        return bankRepository.findByBankCodeAndCountryCode(bankCode, countryCode);
    }

    @Transactional(readOnly = true)
    public List<BankResponse> searchBanksByName(String name) {
        return bankRepository.findByNameContaining(name)
                .stream()
                .map(BankResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
