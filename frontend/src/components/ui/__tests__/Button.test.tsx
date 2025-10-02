import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import Icon from '../Icon';

describe('Button Component', () => {
  it('sollte rendern mit Text', () => {
    render(<Button>Klick mich</Button>);
    expect(screen.getByText('Klick mich')).toBeInTheDocument();
  });

  it('sollte verschiedene Varianten unterstützen', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button')).toHaveClass('hover:bg-gray-100');
  });

  it('sollte verschiedene Größen unterstützen', () => {
    const { rerender } = render(<Button size="sm">Klein</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Button size="lg">Groß</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('sollte onClick-Handler aufrufen', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Klick mich</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sollte disabled sein wenn disabled prop gesetzt', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('sollte Loading-Spinner anzeigen', () => {
    render(<Button loading>Lädt</Button>);
    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
    expect(button.querySelector('svg.animate-spin')).toBeInTheDocument();
  });

  it('sollte Icon anzeigen', () => {
    render(
      <Button icon={<Icon name="check" size={16} />}>
        Mit Icon
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('sollte fullWidth Klasse anwenden', () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole('button')).toHaveClass('w-full');
  });

  it('sollte custom className hinzufügen', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('sollte Icon links oder rechts positionieren', () => {
    const { rerender } = render(
      <Button icon={<Icon name="check" size={16} />} iconPosition="left">
        Links
      </Button>
    );

    let button = screen.getByRole('button');
    let svg = button.querySelector('svg');
    expect(svg).toBeTruthy();

    rerender(
      <Button icon={<Icon name="check" size={16} />} iconPosition="right">
        Rechts
      </Button>
    );

    button = screen.getByRole('button');
    svg = button.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
