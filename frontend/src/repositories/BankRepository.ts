import { BaseRepository } from './BaseRepository';
import { bankApi, Bank } from '../services/api';

class BankRepositoryClass extends BaseRepository {
    constructor() {
        super();
        this.defaultCacheConfig = {
            ttl: 5 * 60 * 1000,
            enabled: true
        };
        this.defaultRetryConfig = {
            maxRetries: 3,
            retryDelay: 1000,
            retryableStatuses: [408, 429, 500, 502, 503, 504]
        };
    }

    async getAllBanks(): Promise<Bank[]> {
        const cacheKey = this.getCacheKey('banks', 'all');

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.getAllBanks(),
            { ttl: 5 * 60 * 1000 },
            { maxRetries: 3 }
        );
    }

    async getBankById(id: number): Promise<Bank> {
        const cacheKey = this.getCacheKey('banks', 'id', id);

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.getBankById(id),
            { ttl: 10 * 60 * 1000 },
            { maxRetries: 2 }
        );
    }

    async createBank(bank: Bank): Promise<Bank> {
        const result = await this.withRetry(
            () => bankApi.createBank(bank),
            { maxRetries: 2, retryDelay: 500 }
        );

        this.invalidateCache('banks:all');

        return result;
    }

    async updateBank(id: number, bank: Bank): Promise<Bank> {
        const result = await this.withRetry(
            () => bankApi.updateBank(id, bank),
            { maxRetries: 2, retryDelay: 500 }
        );

        this.invalidateCache('banks:all');
        this.invalidateCache(`banks:id:${id}`);

        return result;
    }

    async deleteBank(id: number): Promise<void> {
        await this.withRetry(
            () => bankApi.deleteBank(id),
            { maxRetries: 2, retryDelay: 500 }
        );

        this.invalidateCache('banks:all');
        this.invalidateCache(`banks:id:${id}`);
    }

    async searchBanksByName(name: string): Promise<Bank[]> {
        const cacheKey = this.getCacheKey('banks', 'search', name.toLowerCase());

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.searchBanksByName(name),
            { ttl: 3 * 60 * 1000 },
            { maxRetries: 2 }
        );
    }

    async getBanksByCountry(countryCode: string): Promise<Bank[]> {
        const cacheKey = this.getCacheKey('banks', 'country', countryCode);

        return this.withCacheAndRetry(
            cacheKey,
            () => bankApi.getBanksByCountry(countryCode),
            { ttl: 5 * 60 * 1000 },
            { maxRetries: 2 }
        );
    }

    clearAllCache(): void {
        this.invalidateCache('banks:.*');
    }

    clearBankCache(id: number): void {
        this.invalidateCache(`banks:id:${id}`);
    }
}

export const BankRepository = new BankRepositoryClass();
