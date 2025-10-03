import { useState, useCallback } from 'react';
import { IbanValidationResponse } from '../services/api';
import { IbanRepository } from '../repositories/IbanRepository';

export const useIbanValidation = () => {
    const [iban, setIban] = useState('');
    const [result, setResult] = useState<IbanValidationResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formatIban = useCallback((value: string) => {
        const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        return cleaned.replace(/(.{4})/g, '$1 ').trim();
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatIban(e.target.value);
        setIban(formatted);
        if (result) setResult(null);
        if (error) setError(null);
    }, [formatIban, result, error]);

    const validateIban = useCallback(async () => {
        if (!iban.trim()) {
            setError('Bitte geben Sie eine IBAN ein');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await IbanRepository.validateIban({ iban });
            setResult(response);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Validierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
            setResult(null);
        } finally {
            setLoading(false);
        }
    }, [iban]);

    const clearInput = useCallback(() => {
        setIban('');
        setResult(null);
        setError(null);
    }, []);

    const setIbanValue = useCallback((value: string) => {
        setIban(value);
        setResult(null);
        setError(null);
    }, []);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            validateIban();
        }
    }, [validateIban]);

    return {
        iban,
        result,
        loading,
        error,
        handleInputChange,
        validateIban,
        clearInput,
        setIbanValue,
        handleKeyPress
    };
};
