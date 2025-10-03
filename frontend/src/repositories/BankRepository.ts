import { BaseRepository } from './BaseRepository';
import { bankApi, Bank } from '../services/api';
import { CACHE_TTL, RETRY, RETRYABLE_STATUSES, CACHE_KEYS } from './constants';

class BankRepositoryClass extends BaseRepository {
    constructor() {
        super();
        this.defaultCacheConfig = {
            ttl: CACHE_TTL.DEFAULT,
            enabled: true
        };
        this.defaultRetryConfig = {
            maxRetries: RETRY.MAX_RETRIES_DEFAULT,
            retryDelay: RETRY.DELAY_DEFAULT,
            retryableStatuses: [...RETRYABLE_STATUSES]
        };
    }

    async getAllBanks(): Promise<Bank[]> {
        const cacheKey = this.getCacheKey('banks', 'all');

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.getAllBanks(),
            { ttl: CACHE_TTL.DEFAULT },
            { maxRetries: RETRY.MAX_RETRIES_DEFAULT }
        );
    }

    async getBankById(id: number): Promise<Bank> {
        const cacheKey = this.getCacheKey('banks', 'id', id);

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.getBankById(id),
            { ttl: CACHE_TTL.LONG },
            { maxRetries: RETRY.MAX_RETRIES_LOW }
        );
    }

    async createBank(bank: Bank): Promise<Bank> {
        const result = await this.withRetry(
            () => bankApi.createBank(bank),
            { maxRetries: RETRY.MAX_RETRIES_LOW, retryDelay: RETRY.DELAY_FAST }
        );

        this.invalidateCache(CACHE_KEYS.BANKS_ALL);

        return result;
    }

    async updateBank(id: number, bank: Bank): Promise<Bank> {
        const result = await this.withRetry(
            () => bankApi.updateBank(id, bank),
            { maxRetries: RETRY.MAX_RETRIES_LOW, retryDelay: RETRY.DELAY_FAST }
        );

        this.invalidateCache(CACHE_KEYS.BANKS_ALL);
        this.invalidateCache(`${CACHE_KEYS.BANKS_ID_PREFIX}${id}`);

        return result;
    }

    async deleteBank(id: number): Promise<void> {
        await this.withRetry(
            () => bankApi.deleteBank(id),
            { maxRetries: RETRY.MAX_RETRIES_LOW, retryDelay: RETRY.DELAY_FAST }
        );

        this.invalidateCache(CACHE_KEYS.BANKS_ALL);
        this.invalidateCache(`${CACHE_KEYS.BANKS_ID_PREFIX}${id}`);
    }

    async searchBanksByName(name: string): Promise<Bank[]> {
        const cacheKey = this.getCacheKey('banks', 'search', name.toLowerCase());

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.searchBanksByName(name),
            { ttl: CACHE_TTL.SHORT },
            { maxRetries: RETRY.MAX_RETRIES_LOW }
        );
    }

    async getBanksByCountry(countryCode: string): Promise<Bank[]> {
        const cacheKey = this.getCacheKey('banks', 'country', countryCode);

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.getBanksByCountry(countryCode),
            { ttl: CACHE_TTL.DEFAULT },
            { maxRetries: RETRY.MAX_RETRIES_LOW }
        );
    }

    clearAllCache(): void {
        this.invalidateCache(CACHE_KEYS.BANKS_PATTERN);
    }

    clearBankCache(id: number): void {
        this.invalidateCache(`${CACHE_KEYS.BANKS_ID_PREFIX}${id}`);
    }
}

export const BankRepository = new BankRepositoryClass();
