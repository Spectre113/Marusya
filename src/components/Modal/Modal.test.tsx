import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('не должен рендериться, если isOpen=false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal content')).toBeNull();
  });

  it('должен рендерить children, если isOpen=true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('должен закрываться по клику на backdrop', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.click(screen.getByText('Modal content').closest('.modal')!);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('не должен закрываться по backdrop, если closeOnBackdrop=false', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose} closeOnBackdrop={false}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.click(screen.getByText('Modal content').closest('.modal')!);

    expect(onClose).not.toHaveBeenCalled();
  });

  it('должен закрываться по Escape', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
