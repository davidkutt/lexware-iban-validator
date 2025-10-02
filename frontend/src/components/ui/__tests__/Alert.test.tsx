import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Alert from '../Alert';

describe('Alert Component', () => {
  it('sollte rendern mit Nachricht', () => {
    render(<Alert>Test Nachricht</Alert>);
    expect(screen.getByText('Test Nachricht')).toBeInTheDocument();
  });

  it('sollte verschiedene Varianten unterstützen', () => {
    const { rerender } = render(<Alert variant="success">Erfolg</Alert>);
    let alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-green-50', 'border-green-300');

    rerender(<Alert variant="error">Fehler</Alert>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50', 'border-red-300');

    rerender(<Alert variant="warning">Warnung</Alert>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-yellow-50', 'border-yellow-300');

    rerender(<Alert variant="info">Info</Alert>);
    alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-blue-50', 'border-blue-300');
  });

  it('sollte Titel anzeigen', () => {
    render(<Alert title="Wichtig">Nachricht</Alert>);
    expect(screen.getByText('Wichtig')).toBeInTheDocument();
  });

  it('sollte Schließen-Button anzeigen', () => {
    const handleClose = vi.fn();
    render(<Alert onClose={handleClose}>Nachricht</Alert>);

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('sollte keinen Schließen-Button ohne onClose anzeigen', () => {
    render(<Alert>Nachricht</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
