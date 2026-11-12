import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-[var(--color-primary)] text-[var(--color-primary-fg)]',
  secondary: 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)]',
  ghost: 'bg-transparent text-[var(--color-text)]',
  danger: 'bg-transparent text-[var(--pill-danger-fg)]',
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`h-9 px-4 rounded-[var(--radius-control)] text-sm font-medium transition-transform
        hover:brightness-95 active:scale-[var(--control-press-scale)] disabled:opacity-50 disabled:pointer-events-none
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]
        ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
