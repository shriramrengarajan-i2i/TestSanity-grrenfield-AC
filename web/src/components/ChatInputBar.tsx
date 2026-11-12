import { useState, type FormEvent } from 'react';
import { Button } from './Button';

export function ChatInputBar({
  disabled,
  onSend,
}: {
  disabled?: boolean;
  onSend: (message: string) => void;
}) {
  const [value, setValue] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t border-[var(--color-border)]">
      <label htmlFor="chat-input" className="sr-only">
        Ask a question
      </label>
      <input
        id="chat-input"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about microgreens…"
        disabled={disabled}
        className="flex-1 h-10 rounded-[var(--radius-control)] border border-[var(--color-border)]
          bg-[var(--color-surface)] text-[var(--color-text)] px-3 text-sm
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
      />
      <Button type="submit" disabled={disabled}>
        Send
      </Button>
    </form>
  );
}
