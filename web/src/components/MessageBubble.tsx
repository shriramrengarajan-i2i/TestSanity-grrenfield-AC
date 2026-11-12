export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[var(--bubble-max-width)] rounded-[var(--radius-card)] px-3 py-2 text-sm ${
          isUser
            ? 'bg-[var(--color-text)] text-[var(--color-surface)]'
            : 'bg-[var(--color-bg)] text-[var(--color-text)]'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
