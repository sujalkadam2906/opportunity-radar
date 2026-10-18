import React from 'react';
import { X } from 'lucide-react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  onClear?: () => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, prefixIcon, onClear, id, value, className = '', ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputContainer}>
          {prefixIcon && <span className={styles.prefixIcon}>{prefixIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            value={value}
            className={`${styles.input} ${prefixIcon ? styles.hasPrefix : ''} ${className}`}
            {...props}
          />
          {onClear && value && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={onClear}
              aria-label="Clear input"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>
        {error && <span className={styles.errorText} role="alert">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
