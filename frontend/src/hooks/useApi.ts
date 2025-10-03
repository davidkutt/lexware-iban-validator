import { useState, useCallback } from 'react';

interface UseApiOptions {
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    initialLoading?: boolean;
}

export function useApi<T = any>(
    apiFunction: (...args: any[]) => Promise<T>,
    options: UseApiOptions = {}
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(options.initialLoading ?? false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (...args: any[]) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            setData(result);
            options.onSuccess?.(result);
            return result;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.message || 'Ein Fehler ist aufgetreten';
            setError(errorMsg);
            options.onError?.(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction, options]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        reset,
        clearError
    };
}
