import { CACHE_TTL, RETRY, RETRYABLE_STATUSES } from './constants';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
}

interface RetryConfig {
    maxRetries: number;
    retryDelay: number;
    retryableStatuses: number[];
}

interface CacheConfig {
    ttl: number;
    enabled: boolean;
}

export class BaseRepository {
    private cache: Map<string, CacheEntry<any>> = new Map();
    protected defaultCacheConfig: CacheConfig;
    protected defaultRetryConfig: RetryConfig;

    constructor(
        cacheConfig: Partial<CacheConfig> = {},
        retryConfig: Partial<RetryConfig> = {}
    ) {
        this.defaultCacheConfig = {
            ttl: CACHE_TTL.DEFAULT,
            enabled: true,
            ...cacheConfig
        };
        this.defaultRetryConfig = {
            maxRetries: RETRY.MAX_RETRIES_DEFAULT,
            retryDelay: RETRY.DELAY_DEFAULT,
            retryableStatuses: [...RETRYABLE_STATUSES],
            ...retryConfig
        };
    }

    protected async withCache<T>(
        key: string,
        fetcher: () => Promise<T>,
        config: Partial<CacheConfig> = {}
    ): Promise<T> {
        const cacheConfig = { ...this.defaultCacheConfig, ...config };

        if (cacheConfig.enabled) {
            const cached = this.getFromCache<T>(key);
            if (cached !== null) {
                return cached;
            }
        }

        const data = await fetcher();

        if (cacheConfig.enabled) {
            this.setInCache(key, data, cacheConfig.ttl);
        }

        return data;
    }

    protected async withRetry<T>(
        operation: () => Promise<T>,
        config: Partial<RetryConfig> = {}
    ): Promise<T> {
        const retryConfig = { ...this.defaultRetryConfig, ...config };
        let lastError: any;

        for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error: any) {
                lastError = error;

                const shouldRetry =
                    attempt < retryConfig.maxRetries &&
                    this.isRetryableError(error, retryConfig.retryableStatuses);

                if (!shouldRetry) {
                    throw error;
                }

                const delay = this.calculateDelay(attempt, retryConfig.retryDelay);
                await this.sleep(delay);
            }
        }

        throw lastError;
    }

    protected async withCacheAndRetry<T>(
        key: string,
        operation: () => Promise<T>,
        cacheConfig: Partial<CacheConfig> = {},
        retryConfig: Partial<RetryConfig> = {}
    ): Promise<T> {
        return this.withCache(
            key,
            () => this.withRetry(operation, retryConfig),
            cacheConfig
        );
    }

    private getFromCache<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const now = Date.now();
        if (now > entry.expiresAt) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    private setInCache<T>(key: string, data: T, ttl: number): void {
        const now = Date.now();
        this.cache.set(key, {
            data,
            timestamp: now,
            expiresAt: now + ttl
        });
    }

    protected invalidateCache(pattern?: string): void {
        if (!pattern) {
            this.cache.clear();
            return;
        }

        const regex = new RegExp(pattern);
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    protected getCacheKey(...parts: (string | number)[]): string {
        return parts.join(':');
    }

    private isRetryableError(error: any, retryableStatuses: number[]): boolean {
        const status = error?.response?.status;
        return status ? retryableStatuses.includes(status) : false;
    }

    private calculateDelay(attempt: number, baseDelay: number): number {
        return baseDelay * Math.pow(2, attempt);
    }

    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    protected clearExpiredCache(): void {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
            if (now > entry.expiresAt) {
                this.cache.delete(key);
            }
        }
    }
}
