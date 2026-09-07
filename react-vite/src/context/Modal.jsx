import { useRef, useState, useContext, createContext, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [modalContent, setModalContent] = useState(null);
  const [onModalClose, setOnModalClose] = useState(null);
  const closeModal = useCallback(() => {
    setModalContent(null);
    if (typeof onModalClose === 'function') {
      setOnModalClose(null);
      onModalClose();
    }
  }, [onModalClose]);
  return <>
    <ModalContext.Provider value={{ modalRef, modalContent, setModalContent, setOnModalClose, closeModal }}>{children}</ModalContext.Provider>
    <div ref={modalRef} />
  </>;
}

export function Modal() {
  const { modalRef, modalContent, closeModal } = useContext(ModalContext);
  const dialogRef = useRef();
  useEffect(() => {
    if (!modalContent) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    const focusable = () => [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]')];
    const input = dialog.querySelector('input, textarea');
    (input || dialog).focus();
    const onKeyDown = event => {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [modalContent, closeModal]);
  if (!modalRef.current || !modalContent) return null;
  return ReactDOM.createPortal(
    <div id="modal">
      <div id="modal-background" onClick={closeModal} />
      <div id="modal-content" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Keyhole dialog" tabIndex={-1}>
        <button className="modal-close" onClick={closeModal} aria-label="Close dialog">×</button>
        {modalContent}
      </div>
    </div>, modalRef.current
  );
}

export const useModal = () => useContext(ModalContext);
