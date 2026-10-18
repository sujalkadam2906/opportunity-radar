import React from 'react';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  selected?: boolean;
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, selected = false, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${styles.card} ${interactive ? styles.interactive : ''} ${selected ? styles.selected : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
