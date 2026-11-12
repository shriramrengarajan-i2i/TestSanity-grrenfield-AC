import { Button } from './Button';

export function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-[var(--pill-danger-bg)] text-[var(--pill-danger-fg)] p-3 text-sm flex items-center justify-between gap-3">
      <span>{message}</span>
      <Button variant="danger" onClick={onRetry} className="shrink-0">
        Retry
      </Button>
    </div>
  );
}
