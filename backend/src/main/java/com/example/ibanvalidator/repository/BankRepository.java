package com.example.ibanvalidator.repository;

import com.example.ibanvalidator.model.Bank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankRepository extends JpaRepository<Bank, Long> {

    Optional<Bank> findByBankCodeAndCountryCode(String bankCode, String countryCode);

    Optional<Bank> findByBic(String bic);

    List<Bank> findByCountryCode(String countryCode);

    @Query("SELECT b FROM Bank b WHERE b.name LIKE %:name%")
    List<Bank> findByNameContaining(@Param("name") String name);
}