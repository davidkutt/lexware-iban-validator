import { BaseRepository } from './BaseRepository';
import { ibanApi, IbanValidationRequest, IbanValidationResponse } from '../services/api';
import { CACHE_TTL, RETRY, CACHE_KEYS } from './constants';

class IbanRepositoryClass extends BaseRepository {
    constructor() {
        super(
            { ttl: CACHE_TTL.LONG },
            { maxRetries: RETRY.MAX_RETRIES_LOW, retryDelay: RETRY.DELAY_FAST }
        );
    }

    async validateIban(request: IbanValidationRequest): Promise<IbanValidationResponse> {
        const cacheKey = this.getCacheKey('iban', 'validate', request.iban.replace(/\s/g, ''));

        return this.withCacheAndRetry(
            cacheKey,
            () => ibanApi.validateIban(request),
            { ttl: CACHE_TTL.LONG },
            { maxRetries: RETRY.MAX_RETRIES_LOW, retryDelay: RETRY.DELAY_FAST }
        );
    }

    clearValidationCache(iban?: string): void {
        if (iban) {
            const cacheKey = this.getCacheKey('iban', 'validate', iban.replace(/\s/g, ''));
            this.invalidateCache(`^${cacheKey}$`);
        } else {
            this.invalidateCache(CACHE_KEYS.IBAN_PATTERN);
        }
    }
}

export const IbanRepository = new IbanRepositoryClass();
