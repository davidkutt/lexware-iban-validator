import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Bank {
  id?: number;
  name: string;
  bic: string;
  bankCode: string;
  countryCode: string;
}

export interface IbanValidationRequest {
  iban: string;
}

export interface IbanValidationResponse {
  valid: boolean;
  iban?: string;
  countryCode?: string;
  checkDigits?: string;
  bankCode?: string;
  accountNumber?: string;
  bank?: Bank;
  errorMessage?: string;
}

export const ibanApi = {
  validateIban: async (request: IbanValidationRequest): Promise<IbanValidationResponse> => {
    const response = await api.post('/iban/validate', request);
    return response.data;
  },
};

export const bankApi = {
  getAllBanks: async (): Promise<Bank[]> => {
    const response = await api.get('/banks');
    return response.data;
  },

  getBankById: async (id: number): Promise<Bank> => {
    const response = await api.get(`/banks/${id}`);
    return response.data;
  },

  createBank: async (bank: Bank): Promise<Bank> => {
    const response = await api.post('/banks', bank);
    return response.data;
  },

  updateBank: async (id: number, bank: Bank): Promise<Bank> => {
    const response = await api.put(`/banks/${id}`, bank);
    return response.data;
  },

  deleteBank: async (id: number): Promise<void> => {
    await api.delete(`/banks/${id}`);
  },
};
