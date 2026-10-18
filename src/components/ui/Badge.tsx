import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'brand'
    | 'fresh'
    | 'applied'
    | 'interview'
    | 'offer'
    | 'rejected'
    | 'scoreHigh'
    | 'scoreMid'
    | 'scoreLow';
  children: React.ReactNode;
}

export function Badge({
  variant = 'default',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}
