package com.example.ibanvalidator.constants;

public final class IbanConstants {

    private IbanConstants() {
        throw new UnsupportedOperationException("Utility class");
    }

    public static final int MIN_IBAN_LENGTH = 15;
    public static final int MAX_IBAN_LENGTH = 34;

    public static final int COUNTRY_CODE_START = 0;
    public static final int COUNTRY_CODE_END = 2;
    public static final int CHECK_DIGITS_START = 2;
    public static final int CHECK_DIGITS_END = 4;
    public static final int BANK_CODE_START = 4;

    public static final char SPACE = ' ';
    public static final char HYPHEN = '-';
    public static final int LOWERCASE_TO_UPPERCASE_OFFSET = 32;

    public static final String IBAN_VALID_CHARS_REGEX = "^[A-Z0-9]+$";

    public static final String COUNTRY_DE = "DE";
    public static final String COUNTRY_AT = "AT";
    public static final String COUNTRY_CH = "CH";
    public static final String COUNTRY_GB = "GB";
    public static final String COUNTRY_FR = "FR";
    public static final String COUNTRY_NL = "NL";
    public static final String COUNTRY_BE = "BE";
    public static final String COUNTRY_ES = "ES";
    public static final String COUNTRY_IT = "IT";

    public static final class BankCodePosition {
        public static final int DE_START = 4;
        public static final int DE_END = 12;
        public static final int AT_START = 4;
        public static final int AT_END = 9;
        public static final int CH_START = 4;
        public static final int CH_END = 9;
        public static final int GB_START = 4;
        public static final int GB_END = 10;
        public static final int FR_START = 4;
        public static final int FR_END = 9;
        public static final int NL_START = 4;
        public static final int NL_END = 8;
        public static final int BE_START = 4;
        public static final int BE_END = 7;
        public static final int ES_START = 4;
        public static final int ES_END = 12;
        public static final int IT_START = 5;
        public static final int IT_END = 10;
        public static final int DEFAULT_START = 4;
        public static final int DEFAULT_END = 8;

        private BankCodePosition() {
            throw new UnsupportedOperationException("Utility class");
        }
    }

    public static final class AccountNumberPosition {
        public static final int DE_START = 12;
        public static final int AT_START = 9;
        public static final int CH_START = 9;
        public static final int GB_START = 10;
        public static final int FR_START = 9;
        public static final int NL_START = 8;
        public static final int BE_START = 7;
        public static final int ES_START = 12;
        public static final int IT_START = 15;
        public static final int DEFAULT_START = 8;

        private AccountNumberPosition() {
            throw new UnsupportedOperationException("Utility class");
        }
    }
}
