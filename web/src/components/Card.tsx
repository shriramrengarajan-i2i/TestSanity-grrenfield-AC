import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-[var(--color-surface)] border border-[var(--color-border)]
        rounded-[var(--radius-card)] shadow-[var(--shadow-card)] p-4 ${className}`}
      {...props}
    />
  );
}
