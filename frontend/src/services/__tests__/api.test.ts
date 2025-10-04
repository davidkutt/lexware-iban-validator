import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockGet, mockPost, mockPut, mockDelete } = vi.hoisted(() => {
  return {
    mockGet: vi.fn(),
    mockPost: vi.fn(),
    mockPut: vi.fn(),
    mockDelete: vi.fn(),
  };
});

vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        get: mockGet,
        post: mockPost,
        put: mockPut,
        delete: mockDelete,
      }),
    },
  };
});

import { ibanApi, bankApi } from '../api';

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

      mockPost.mockResolvedValue(mockResponse);

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

      mockGet.mockResolvedValue({ data: mockBanks });

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

      mockGet.mockResolvedValue({ data: mockBank });

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

      mockPost.mockResolvedValue({ data: { id: 3, ...newBank } });

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

      mockPut.mockResolvedValue({ data: { id: 1, ...updatedBank } });

      const result = await bankApi.updateBank(1, updatedBank);

      expect(mockPut).toHaveBeenCalledWith('/banks/1', updatedBank);
      expect(result).toEqual({ id: 1, ...updatedBank });
    });

    it('sollte Bank löschen', async () => {
      mockDelete.mockResolvedValue({});

      await bankApi.deleteBank(1);

      expect(mockDelete).toHaveBeenCalledWith('/banks/1');
    });
  });
});
