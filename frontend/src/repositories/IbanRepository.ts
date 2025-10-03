import { BaseRepository } from './BaseRepository';
import { ibanApi, IbanValidationRequest, IbanValidationResponse } from '../services/api';

class IbanRepositoryClass extends BaseRepository {
    constructor() {
        super();
        this.defaultCacheConfig = {
            ttl: 10 * 60 * 1000,
            enabled: true
        };
        this.defaultRetryConfig = {
            maxRetries: 2,
            retryDelay: 500,
            retryableStatuses: [408, 429, 500, 502, 503, 504]
        };
    }

    async validateIban(request: IbanValidationRequest): Promise<IbanValidationResponse> {
        const cacheKey = this.getCacheKey('iban', 'validate', request.iban.replace(/\s/g, ''));

        return this.withCacheAndRetry(
            cacheKey,
            () => ibanApi.validateIban(request),
            { ttl: 10 * 60 * 1000 },
            { maxRetries: 2, retryDelay: 500 }
        );
    }

    clearValidationCache(iban?: string): void {
        if (iban) {
            const cacheKey = this.getCacheKey('iban', 'validate', iban.replace(/\s/g, ''));
            this.invalidateCache(`^${cacheKey}$`);
        } else {
            this.invalidateCache('iban:validate:.*');
        }
    }
}

export const IbanRepository = new IbanRepositoryClass();
