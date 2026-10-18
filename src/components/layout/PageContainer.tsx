import React from 'react';
import styles from './PageContainer.module.css';

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return <main className={`${styles.page} ${className}`}>{children}</main>;
}
