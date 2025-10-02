package com.example.ibanvalidator.controller;

import com.example.ibanvalidator.dto.BankRequest;
import com.example.ibanvalidator.dto.BankResponse;
import com.example.ibanvalidator.dto.IbanValidationRequest;
import com.example.ibanvalidator.dto.IbanValidationResponse;
import com.example.ibanvalidator.service.BankService;
import com.example.ibanvalidator.service.IbanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class IbanController {

    private final IbanService ibanService;
    private final BankService bankService;

    public IbanController(IbanService ibanService, BankService bankService) {
        this.ibanService = ibanService;
        this.bankService = bankService;
    }

    @PostMapping("/iban/validate")
    public ResponseEntity<IbanValidationResponse> validateIban(
            @Valid @RequestBody IbanValidationRequest request) {

        IbanValidationResponse response = ibanService.validateIban(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/banks")
    public ResponseEntity<List<BankResponse>> getAllBanks() {
        List<BankResponse> banks = bankService.getAllBanks();
        return ResponseEntity.ok(banks);
    }

    @GetMapping("/banks/{id}")
    public ResponseEntity<BankResponse> getBankById(@PathVariable Long id) {
        BankResponse bank = bankService.getBankById(id);
        return ResponseEntity.ok(bank);
    }

    @GetMapping("/banks/search")
    public ResponseEntity<List<BankResponse>> searchBanks(
            @RequestParam String name) {

        List<BankResponse> banks = bankService.searchBanksByName(name);
        return ResponseEntity.ok(banks);
    }

    @GetMapping("/banks/country/{countryCode}")
    public ResponseEntity<List<BankResponse>> getBanksByCountry(
            @PathVariable String countryCode) {

        List<BankResponse> banks = bankService.getBanksByCountry(countryCode);
        return ResponseEntity.ok(banks);
    }

    @PostMapping("/banks")
    public ResponseEntity<BankResponse> createBank(
            @Valid @RequestBody BankRequest request) {

        BankResponse createdBank = bankService.createBank(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdBank.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdBank);
    }

    @PutMapping("/banks/{id}")
    public ResponseEntity<BankResponse> updateBank(
            @PathVariable Long id,
            @Valid @RequestBody BankRequest request) {

        BankResponse updatedBank = bankService.updateBank(id, request);
        return ResponseEntity.ok(updatedBank);
    }

    @DeleteMapping("/banks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteBank(@PathVariable Long id) {
        bankService.deleteBank(id);
        return ResponseEntity.noContent().build();
    }
}
