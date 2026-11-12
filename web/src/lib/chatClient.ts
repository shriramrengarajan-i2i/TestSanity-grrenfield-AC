export interface ChatReply {
  reply: string;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';

// No auth header, no credentials: the visitor never identifies themselves
// to use the chatbot (REQ-120, REQ-121).
export async function sendChatMessage(message: string): Promise<ChatReply> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error(`Chat request failed with status ${res.status}`);
  }
  return res.json();
}
