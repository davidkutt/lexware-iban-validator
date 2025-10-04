package com.example.ibanvalidator.config;

import java.util.Map;

public final class IbanCountryConfig {

    private IbanCountryConfig() {
        throw new UnsupportedOperationException("Utility class");
    }

    public record CountryFormat(
        String code,
        int bankCodeStart,
        int bankCodeEnd,
        int accountNumberStart
    ) {}

    private static final CountryFormat DEFAULT_FORMAT = new CountryFormat("DEFAULT", 4, 8, 8);

    private static final Map<String, CountryFormat> COUNTRY_FORMATS = Map.ofEntries(
        Map.entry("DE", new CountryFormat("DE", 4, 12, 12)),
        Map.entry("AT", new CountryFormat("AT", 4, 9, 9)),
        Map.entry("CH", new CountryFormat("CH", 4, 9, 9)),
        Map.entry("GB", new CountryFormat("GB", 4, 10, 10)),
        Map.entry("FR", new CountryFormat("FR", 4, 9, 9)),
        Map.entry("NL", new CountryFormat("NL", 4, 8, 8)),
        Map.entry("BE", new CountryFormat("BE", 4, 7, 7)),
        Map.entry("ES", new CountryFormat("ES", 4, 12, 12)),
        Map.entry("IT", new CountryFormat("IT", 5, 10, 15))
    );

    public static CountryFormat getFormat(String countryCode) {
        return COUNTRY_FORMATS.getOrDefault(countryCode, DEFAULT_FORMAT);
    }
}
