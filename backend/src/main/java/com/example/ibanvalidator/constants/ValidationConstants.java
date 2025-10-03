package com.example.ibanvalidator.constants;

public final class ValidationConstants {

    private ValidationConstants() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static final int BANK_NAME_MIN_LENGTH = 2;
    public static final int BANK_NAME_MAX_LENGTH = 200;

    public static final int BIC_MIN_LENGTH = 8;
    public static final int BIC_MAX_LENGTH = 11;

    public static final int BANK_CODE_MIN_LENGTH = 4;
    public static final int BANK_CODE_MAX_LENGTH = 20;

    public static final int COUNTRY_CODE_LENGTH = 2;
}
