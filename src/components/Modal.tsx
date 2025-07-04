// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-body">
          <p>{message}</p>
          {children}
        </div>
        <div className="modal-footer">
          <button onClick={onCancel} className="modal-button secondary">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="modal-button primary">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
