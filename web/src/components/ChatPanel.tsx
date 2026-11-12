import { useState } from 'react';
import { X } from 'lucide-react';
import { MessageBubble, type ChatMessage } from './MessageBubble';
import { ChatInputBar } from './ChatInputBar';
import { ErrorBanner } from './ErrorBanner';
import { Button } from './Button';
import { sendChatMessage } from '../lib/chatClient';

const STARTER_PROMPTS = [
  'What is a microgreen?',
  'How do I start growing microgreens?',
  'Are microgreens as nutritious as mature vegetables?',
];

interface ChatPanelProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  onClose: () => void;
}

// No login/identity step gates this panel: anyone can open it and chat
// without registering (REQ-120, REQ-121, REQ-122).
export function ChatPanel({ messages, onMessagesChange, onClose }: ChatPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  async function handleSend(text: string) {
    const userMessage: ChatMessage = { id: crypto.randomUUID(), role: 'user', text };
    onMessagesChange([...messages, userMessage]);
    setLastMessage(text);
    await submit(text, [...messages, userMessage]);
  }

  async function submit(text: string, currentMessages: ChatMessage[]) {
    setLoading(true);
    setError(null);
    try {
      const { reply } = await sendChatMessage(text);
      const assistantMessage: ChatMessage = { id: crypto.randomUUID(), role: 'assistant', text: reply };
      onMessagesChange([...currentMessages, assistantMessage]);
    } catch {
      setError('The assistant is unavailable right now.');
    } finally {
      setLoading(false);
    }
  }

  function handleRetry() {
    if (lastMessage) {
      void submit(lastMessage, messages);
    }
  }

  return (
    <div
      role="dialog"
      aria-label="Chat with the MicroGreens assistant"
      className="fixed bottom-0 right-0 top-0 w-full sm:w-[var(--chat-panel-width)] md:w-1/3 bg-[var(--color-surface)]
        border-l border-[var(--color-border)] shadow-[var(--shadow-card)] flex flex-col z-50"
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-[var(--color-border)]">
        <span className="font-semibold text-[var(--color-text)]">Ask MicroGreens</span>
        <button type="button" aria-label="Close chat" onClick={onClose} className="text-[var(--color-text)]">
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-[var(--color-text-muted)]">
              Ask anything about microgreens — no account needed.
            </p>
            {STARTER_PROMPTS.map((prompt) => (
              <Button key={prompt} variant="secondary" onClick={() => handleSend(prompt)}>
                {prompt}
              </Button>
            ))}
          </div>
        )}
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {loading && (
          <p className="text-sm text-[var(--color-text-muted)]" role="status">
            Thinking…
          </p>
        )}
        {error && <ErrorBanner message={error} onRetry={handleRetry} />}
      </div>
      <ChatInputBar disabled={loading} onSend={handleSend} />
    </div>
  );
}
