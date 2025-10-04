import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import IbanValidator from '../IbanValidator';
import { IbanRepository } from '../../repositories/IbanRepository';

vi.mock('../../repositories/IbanRepository', () => ({
  IbanRepository: {
    validateIban: vi.fn(),
  },
}));

describe('IbanValidator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sollte initial rendern', () => {
    render(<IbanValidator />);

    expect(screen.getByText('IBAN-Validator')).toBeInTheDocument();
    expect(screen.getByLabelText('IBAN-Nummer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /IBAN Validieren/i })).toBeInTheDocument();
  });

  it('sollte IBAN formatieren während der Eingabe', async () => {
    const user = userEvent.setup();
    render(<IbanValidator />);

    const input = screen.getByLabelText('IBAN-Nummer');

    await act(async () => {
      await user.type(input, 'DE89370400440532013000');
    });

    expect(input).toHaveValue('DE89 3704 0044 0532 0130 00');
  });

  it('sollte erfolgreiche Validierung anzeigen', async () => {
    const mockResponse = {
      valid: true,
      iban: 'DE89370400440532013000',
      countryCode: 'DE',
      checkDigits: '89',
      bankCode: '37040044',
      accountNumber: '0532013000',
    };

    vi.mocked(IbanRepository.validateIban).mockResolvedValue(mockResponse);

    const user = userEvent.setup();
    render(<IbanValidator />);

    const input = screen.getByLabelText('IBAN-Nummer');
    await user.type(input, 'DE89370400440532013000');

    const button = screen.getByRole('button', { name: /IBAN Validieren/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Gültige IBAN')).toBeInTheDocument();
      expect(screen.getByText('DE89370400440532013000')).toBeInTheDocument();
      expect(screen.getByText('37040044')).toBeInTheDocument();
    });
  });

  it('sollte Fehler bei ungültiger IBAN anzeigen', async () => {
    const mockResponse = {
      valid: false,
      errorMessage: 'Ungültige Prüfziffer',
    };

    vi.mocked(IbanRepository.validateIban).mockResolvedValue(mockResponse);

    const user = userEvent.setup();
    render(<IbanValidator />);

    const input = screen.getByLabelText('IBAN-Nummer');
    await user.type(input, 'DE00000000000000000000');

    const button = screen.getByRole('button', { name: /IBAN Validieren/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Ungültige IBAN')).toBeInTheDocument();
      expect(screen.getByText('Ungültige Prüfziffer')).toBeInTheDocument();
    });
  });

  it('sollte API-Fehler behandeln', async () => {
    vi.mocked(IbanRepository.validateIban).mockRejectedValue({
      response: { data: { message: 'Server Fehler' } },
    });

    const user = userEvent.setup();
    render(<IbanValidator />);

    const input = screen.getByLabelText('IBAN-Nummer');
    await user.type(input, 'DE89370400440532013000');

    const button = screen.getByRole('button', { name: /IBAN Validieren/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText('Server Fehler')).toBeInTheDocument();
    });
  });

  it('sollte Eingabe löschen', async () => {
    const user = userEvent.setup();
    render(<IbanValidator />);

    const input = screen.getByLabelText('IBAN-Nummer');
    await user.type(input, 'DE89370400440532013000');

    expect(input).toHaveValue('DE89 3704 0044 0532 0130 00');

    const clearButton = screen.getByLabelText('Eingabe löschen');
    await user.click(clearButton);

    expect(input).toHaveValue('');
  });

  it('sollte Beispiel-IBAN setzen', async () => {
    const user = userEvent.setup();
    render(<IbanValidator />);

    const exampleButton = screen.getByText('DE89 3704 0044 0532 0130 00');

    await act(async () => {
      await user.click(exampleButton);
    });

    const input = screen.getByLabelText('IBAN-Nummer');
    expect(input).toHaveValue('DE89 3704 0044 0532 0130 00');
  });

  it('sollte Enter-Taste für Validierung unterstützen', async () => {
    const mockResponse = {
      valid: true,
      iban: 'DE89370400440532013000',
      countryCode: 'DE',
      checkDigits: '89',
      bankCode: '37040044',
      accountNumber: '0532013000',
    };

    vi.mocked(IbanRepository.validateIban).mockResolvedValue(mockResponse);

    render(<IbanValidator />);

    const input = screen.getByLabelText('IBAN-Nummer');
    fireEvent.change(input, { target: { value: 'DE89370400440532013000' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(screen.getByText('Gültige IBAN')).toBeInTheDocument();
    });
  });

  it('sollte Button deaktivieren bei leerem Input', () => {
    render(<IbanValidator />);

    const button = screen.getByRole('button', { name: /IBAN Validieren/i });
    expect(button).toBeDisabled();
  });
});
