import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge Component', () => {
  it('sollte rendern mit Text', () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('sollte verschiedene Varianten unterstützen', () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText('Primary')).toHaveClass('bg-primary-100', 'text-primary-800');

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText('Success')).toHaveClass('bg-green-100', 'text-green-800');

    rerender(<Badge variant="danger">Danger</Badge>);
    expect(screen.getByText('Danger')).toHaveClass('bg-red-100', 'text-red-800');

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText('Warning')).toHaveClass('bg-yellow-100', 'text-yellow-800');

    rerender(<Badge variant="info">Info</Badge>);
    expect(screen.getByText('Info')).toHaveClass('bg-blue-100', 'text-blue-800');

    rerender(<Badge variant="gray">Gray</Badge>);
    expect(screen.getByText('Gray')).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('sollte verschiedene Größen unterstützen', () => {
    const { rerender } = render(<Badge size="sm">Klein</Badge>);
    expect(screen.getByText('Klein')).toHaveClass('px-2', 'py-0.5', 'text-xs');

    rerender(<Badge size="md">Mittel</Badge>);
    expect(screen.getByText('Mittel')).toHaveClass('px-2.5', 'py-0.5', 'text-sm');

    rerender(<Badge size="lg">Groß</Badge>);
    expect(screen.getByText('Groß')).toHaveClass('px-3', 'py-1', 'text-base');
  });

  it('sollte rounded Variante unterstützen', () => {
    const { rerender } = render(<Badge>Normal</Badge>);
    expect(screen.getByText('Normal')).toHaveClass('rounded');

    rerender(<Badge rounded>Rounded</Badge>);
    expect(screen.getByText('Rounded')).toHaveClass('rounded-full');
  });

  it('sollte custom className hinzufügen', () => {
    render(<Badge className="custom-class">Badge</Badge>);
    expect(screen.getByText('Badge')).toHaveClass('custom-class');
  });
});
