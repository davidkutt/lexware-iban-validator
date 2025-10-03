import { useState, useEffect, useCallback } from 'react';
import { Bank } from '../services/api';
import { BankRepository } from '../repositories/BankRepository';

export const useBankCrud = () => {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBanks = useCallback(async () => {
        try {
            setLoading(true);
            const banksData = await BankRepository.getAllBanks();
            setBanks(banksData);
            setError(null);
        } catch (err: any) {
            setError('Fehler beim Laden der Banken');
            console.error('Fehler beim Laden der Banken:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanks();
    }, [fetchBanks]);

    const createBank = useCallback(async (bankData: Bank) => {
        try {
            const newBank = await BankRepository.createBank(bankData);
            setBanks(prev => [...prev, newBank]);
            setError(null);
            return newBank;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Fehler beim Erstellen der Bank';
            setError(errorMsg);
            throw err;
        }
    }, []);

    const updateBank = useCallback(async (id: number, bankData: Bank) => {
        try {
            const updatedBank = await BankRepository.updateBank(id, bankData);
            setBanks(prev => prev.map(bank => bank.id === id ? updatedBank : bank));
            setError(null);
            return updatedBank;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Fehler beim Aktualisieren der Bank';
            setError(errorMsg);
            throw err;
        }
    }, []);

    const deleteBank = useCallback(async (id: number, bankName: string) => {
        if (!window.confirm(`Möchten Sie "${bankName}" wirklich löschen?`)) {
            return false;
        }

        try {
            await BankRepository.deleteBank(id);
            setBanks(prev => prev.filter(bank => bank.id !== id));
            setError(null);
            return true;
        } catch (err: any) {
            setError('Fehler beim Löschen der Bank');
            throw err;
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        banks,
        loading,
        error,
        fetchBanks,
        createBank,
        updateBank,
        deleteBank,
        clearError
    };
};
