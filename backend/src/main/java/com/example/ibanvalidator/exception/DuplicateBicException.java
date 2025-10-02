package com.example.ibanvalidator.exception;

public class DuplicateBicException extends RuntimeException {

    private final String bic;

    public DuplicateBicException(String bic) {
        super(String.format("Bank mit BIC '%s' existiert bereits", bic));
        this.bic = bic;
    }

    public String getBic() {
        return bic;
    }
}
