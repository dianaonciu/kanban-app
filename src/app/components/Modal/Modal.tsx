'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const Modal = ({ children, onClose }: ModalProps) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let root = document.getElementById('modal-root');
    if (!root) {
      root = document.createElement('div');
      root.setAttribute('id', 'modal-root');
      document.body.appendChild(root);
    }
    setPortalRoot(root);

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close modal">
          ×
        </button>
        {children}
      </div>
    </div>,
    portalRoot,
  );
};

export default Modal;
