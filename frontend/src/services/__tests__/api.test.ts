import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { ibanApi, bankApi } from '../api';

vi.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ibanApi', () => {
    it('sollte IBAN validieren', async () => {
      const mockResponse = {
        data: {
          valid: true,
          iban: 'DE89370400440532013000',
          countryCode: 'DE',
          checkDigits: '89',
          bankCode: '37040044',
          accountNumber: '0532013000',
        },
      };

      const mockPost = vi.fn().mockResolvedValue(mockResponse);
      vi.mocked(axios.create).mockReturnValue({
        post: mockPost,
      } as any);

      const result = await ibanApi.validateIban({ iban: 'DE89370400440532013000' });

      expect(mockPost).toHaveBeenCalledWith('/iban/validate', { iban: 'DE89370400440532013000' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('bankApi', () => {
    it('sollte alle Banken abrufen', async () => {
      const mockBanks = [
        { id: 1, name: 'Deutsche Bank', bic: 'DEUTDEFFXXX', bankCode: '10070000', countryCode: 'DE' },
        { id: 2, name: 'Commerzbank', bic: 'COBADEFFXXX', bankCode: '10040000', countryCode: 'DE' },
      ];

      const mockGet = vi.fn().mockResolvedValue({ data: mockBanks });
      vi.mocked(axios.create).mockReturnValue({
        get: mockGet,
      } as any);

      const result = await bankApi.getAllBanks();

      expect(mockGet).toHaveBeenCalledWith('/banks');
      expect(result).toEqual(mockBanks);
    });

    it('sollte Bank nach ID abrufen', async () => {
      const mockBank = {
        id: 1,
        name: 'Deutsche Bank',
        bic: 'DEUTDEFFXXX',
        bankCode: '10070000',
        countryCode: 'DE',
      };

      const mockGet = vi.fn().mockResolvedValue({ data: mockBank });
      vi.mocked(axios.create).mockReturnValue({
        get: mockGet,
      } as any);

      const result = await bankApi.getBankById(1);

      expect(mockGet).toHaveBeenCalledWith('/banks/1');
      expect(result).toEqual(mockBank);
    });

    it('sollte neue Bank erstellen', async () => {
      const newBank = {
        name: 'Test Bank',
        bic: 'TESTDEFFXXX',
        bankCode: '12345678',
        countryCode: 'DE',
      };

      const mockPost = vi.fn().mockResolvedValue({ data: { id: 3, ...newBank } });
      vi.mocked(axios.create).mockReturnValue({
        post: mockPost,
      } as any);

      const result = await bankApi.createBank(newBank);

      expect(mockPost).toHaveBeenCalledWith('/banks', newBank);
      expect(result).toEqual({ id: 3, ...newBank });
    });

    it('sollte Bank aktualisieren', async () => {
      const updatedBank = {
        name: 'Updated Bank',
        bic: 'TESTDEFFXXX',
        bankCode: '12345678',
        countryCode: 'DE',
      };

      const mockPut = vi.fn().mockResolvedValue({ data: { id: 1, ...updatedBank } });
      vi.mocked(axios.create).mockReturnValue({
        put: mockPut,
      } as any);

      const result = await bankApi.updateBank(1, updatedBank);

      expect(mockPut).toHaveBeenCalledWith('/banks/1', updatedBank);
      expect(result).toEqual({ id: 1, ...updatedBank });
    });

    it('sollte Bank löschen', async () => {
      const mockDelete = vi.fn().mockResolvedValue({});
      vi.mocked(axios.create).mockReturnValue({
        delete: mockDelete,
      } as any);

      await bankApi.deleteBank(1);

      expect(mockDelete).toHaveBeenCalledWith('/banks/1');
    });
  });
});
