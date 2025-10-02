package com.example.ibanvalidator.config;

import com.example.ibanvalidator.model.Bank;
import com.example.ibanvalidator.repository.BankRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private BankRepository bankRepository;

    @Override
    public void run(String... args) throws Exception {
        if (bankRepository.count() == 0) {
            initializeGermanBanks();
            initializeUKBanks();
            initializeFrenchBanks();
        }
    }

    private void initializeGermanBanks() {
        bankRepository.save(new Bank("Deutsche Bank AG", "DEUTDEFFXXX", "10070000", "DE"));
        bankRepository.save(new Bank("Commerzbank AG", "COBADEFFXXX", "37040044", "DE"));
        bankRepository.save(new Bank("DZ Bank AG", "GENODEFFXXX", "50060400", "DE"));
        bankRepository.save(new Bank("Sparkasse KölnBonn", "COLSDE33XXX", "37050299", "DE"));
        bankRepository.save(new Bank("Postbank", "PBNKDEFFXXX", "10010010", "DE"));
        bankRepository.save(new Bank("ING-DiBa", "INGDDEFFXXX", "50010517", "DE"));
    }

    private void initializeUKBanks() {
        bankRepository.save(new Bank("Barclays Bank", "BARCGB22XXX", "202053", "GB"));
        bankRepository.save(new Bank("HSBC Bank", "MIDLGB22XXX", "400530", "GB"));
        bankRepository.save(new Bank("Lloyds Bank", "LOYDGB21XXX", "309634", "GB"));
        bankRepository.save(new Bank("NatWest Bank", "NWBKGB2LXXX", "601613", "GB"));
    }

    private void initializeFrenchBanks() {
        bankRepository.save(new Bank("BNP Paribas", "BNPAFRPPXXX", "20041", "FR"));
        bankRepository.save(new Bank("Crédit Agricole", "AGRIFRPPXXX", "12006", "FR"));
        bankRepository.save(new Bank("Société Générale", "SOGEFRPPXXX", "30003", "FR"));
    }
}