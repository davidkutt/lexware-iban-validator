export const TIME = {
    ONE_SECOND: 1000,
    HALF_SECOND: 500,
    ONE_MINUTE: 60 * 1000,
    FIVE_MINUTES: 5 * 60 * 1000,
    TEN_MINUTES: 10 * 60 * 1000,
    THREE_MINUTES: 3 * 60 * 1000,
} as const;

export const HTTP_STATUS = {
    REQUEST_TIMEOUT: 408,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const;

export const RETRY = {
    MAX_RETRIES_DEFAULT: 3,
    MAX_RETRIES_LOW: 2,
    DELAY_DEFAULT: TIME.ONE_SECOND,
    DELAY_FAST: TIME.HALF_SECOND,
} as const;

export const CACHE_TTL = {
    DEFAULT: TIME.FIVE_MINUTES,
    LONG: TIME.TEN_MINUTES,
    SHORT: TIME.THREE_MINUTES,
} as const;

export const RETRYABLE_STATUSES = [
    HTTP_STATUS.REQUEST_TIMEOUT,
    HTTP_STATUS.TOO_MANY_REQUESTS,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.BAD_GATEWAY,
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    HTTP_STATUS.GATEWAY_TIMEOUT,
] as const;

export const CACHE_KEYS = {
    BANKS_ALL: 'banks:all',
    BANKS_ID_PREFIX: 'banks:id:',
    BANKS_SEARCH_PREFIX: 'banks:search:',
    BANKS_COUNTRY_PREFIX: 'banks:country:',
    IBAN_VALIDATE_PREFIX: 'iban:validate:',
    BANKS_PATTERN: 'banks:.*',
    IBAN_PATTERN: 'iban:validate:.*',
} as const;

export const TECH_STACK = [
    { name: 'Spring Boot', color: 'green' as const, link: 'https://spring.io/' },
    { name: 'React', color: 'blue' as const, link: 'https://reactjs.org/' },
    { name: 'TypeScript', color: 'blue' as const, link: 'https://www.typescriptlang.org/' },
    { name: 'Tailwind', color: 'cyan' as const, link: 'https://tailwindcss.com/' },
    { name: 'PostgreSQL', color: 'indigo' as const, link: 'https://www.postgresql.org/' },
] as const;
