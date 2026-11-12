import { MessageCircle } from 'lucide-react';

export function ChatLauncher({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      aria-label="Open chat"
      onClick={onOpen}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-[var(--radius-card)] bg-[var(--color-primary)]
        text-[var(--color-primary-fg)] shadow-[var(--shadow-card)] flex items-center justify-center
        active:scale-[var(--control-press-scale)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-[var(--color-focus)]"
    >
      <MessageCircle size={20} strokeWidth={2.5} />
    </button>
  );
}
