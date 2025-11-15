import { AlertTriangle, X } from 'lucide-react';
import styles from '../styles/ConfirmDialog.module.css';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Yes', cancelText = 'No', type = 'danger' }) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={`${styles.icon} ${styles[type]}`}>
            <AlertTriangle size={24} />
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={`${styles.message} ${type === 'danger' ? styles.dangerMessage : ''}`}>{message}</p>
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelButton} onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmButton} ${styles[type]}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}