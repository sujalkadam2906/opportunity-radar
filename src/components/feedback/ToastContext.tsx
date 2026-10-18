import React, { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../../types';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastContext } from './toastContextDef';
import styles from './Toast.module.css';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastMessage = { id, type, title, description, durationMs: 4000 };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, newToast.durationMs);
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, description?: string) => showToast('success', title, description),
    [showToast]
  );
  const error = useCallback(
    (title: string, description?: string) => showToast('error', title, description),
    [showToast]
  );
  const info = useCallback(
    (title: string, description?: string) => showToast('info', title, description),
    [showToast]
  );
  const warning = useCallback(
    (title: string, description?: string) => showToast('warning', title, description),
    [showToast]
  );

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} aria-hidden="true" />;
      case 'error':
        return <AlertCircle size={18} aria-hidden="true" />;
      case 'warning':
        return <AlertTriangle size={18} aria-hidden="true" />;
      case 'info':
      default:
        return <Info size={18} aria-hidden="true" />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning }}>
      {children}
      <div
        className={styles.toastContainer}
        aria-live="polite"
        aria-atomic="false"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${styles.toast} ${styles[toast.type]}`}
            role="status"
          >
            <div className={styles.iconWrapper}>{getIcon(toast.type)}</div>
            <div className={styles.content}>
              <div className={styles.title}>{toast.title}</div>
              {toast.description && (
                <div className={styles.description}>{toast.description}</div>
              )}
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
