import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input Component', () => {
  it('sollte rendern mit Label', () => {
    render(<Input label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('sollte required Stern anzeigen', () => {
    render(<Input label="Name" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('sollte Fehlermeldung anzeigen', () => {
    render(<Input label="Email" error="Ungültige E-Mail" />);
    expect(screen.getByText('Ungültige E-Mail')).toBeInTheDocument();
  });

  it('sollte Helper-Text anzeigen wenn kein Fehler', () => {
    render(<Input label="Passwort" helperText="Mindestens 8 Zeichen" />);
    expect(screen.getByText('Mindestens 8 Zeichen')).toBeInTheDocument();
  });

  it('sollte Error-Styling anwenden', () => {
    render(<Input error="Fehler" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-500');
  });

  it('sollte onChange-Handler aufrufen', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('sollte disabled sein', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sollte Placeholder anzeigen', () => {
    render(<Input placeholder="Eingabe..." />);
    expect(screen.getByPlaceholderText('Eingabe...')).toBeInTheDocument();
  });

  it('sollte custom className hinzufügen', () => {
    render(<Input className="font-mono" />);
    expect(screen.getByRole('textbox')).toHaveClass('font-mono');
  });
});
