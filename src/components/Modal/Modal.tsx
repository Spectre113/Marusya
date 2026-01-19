import { useEffect, type ReactNode } from 'react';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  modalType?: 'film' | 'user';
}

export const Modal = ({
  isOpen,
  onClose,
  children,
  closeOnBackdrop = true,
  modalType = 'film',
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="flex modal"
      onClick={closeOnBackdrop ? onClose : undefined}
      datatype={modalType}
    >
      <div
        className="flex modal__content"
        onClick={(e) => e.stopPropagation()}
        datatype={modalType}
      >
        <button className="flex btn-reset modal__close" onClick={onClose} aria-label="Close">
          <svg
            width="19"
            height="19"
            viewBox="0 0 19 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.79293 9.20715L0 1.41421L1.41421 0L9.20713 7.79285L17 0L18.4142 1.41421L10.6213 9.20715L18.4142 17L17 18.4142L9.20713 10.6213L1.41421 18.4142L0 17L7.79293 9.20715Z"
              fill="black"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};
