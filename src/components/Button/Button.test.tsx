import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button component', () => {
  it('должен отображать текст (title)', () => {
    render(<Button title="Нажми меня" />);
    expect(screen.getByRole('button')).toHaveTextContent('Нажми меня');
  });

  it('должен вызывать onClick при нажатии', () => {
    const handleClick = vi.fn();
    render(<Button title="Клик" onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('не должен вызывать onClick, если кнопка заблокирована (isDisabled)', () => {
    const handleClick = vi.fn();
    render(<Button title="Клик" onClick={handleClick} isDisabled={true} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('должен добавлять кастомный класс через className', () => {
    render(<Button title="Класс" className="my-custom-class" />);
    expect(screen.getByRole('button')).toHaveClass('my-custom-class');
  });

  it('должен корректно устанавливать data-атрибуты', () => {
    render(<Button title="Стили" variant="secondary" width="wide" />);
    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('data-variant', 'secondary');
    expect(button).toHaveAttribute('data-width', 'wide');
  });

  it('должен отображать иконку, если она передана', () => {
    render(<Button title="С иконкой" imageSvg={<span data-testid="test-svg">SVG</span>} />);
    expect(screen.getByTestId('test-svg')).toBeInTheDocument();
  });
});
