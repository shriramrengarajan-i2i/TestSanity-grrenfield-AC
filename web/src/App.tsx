import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { TopBar } from './components/TopBar';
import { ChatLauncher } from './components/ChatLauncher';
import { ChatPanel } from './components/ChatPanel';
import type { ChatMessage } from './components/MessageBubble';
import { Home } from './routes/Home';
import { Varieties } from './routes/Varieties';
import { Growing } from './routes/Growing';
import { Nutrition } from './routes/Nutrition';
import { Recipes } from './routes/Recipes';
import { Safety } from './routes/Safety';

// Chat state lives above the router outlet so it survives a tab switch
// without ever persisting an identity token (RULE-0004, REQ-120).
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <TopBar />
      <main className="max-w-[var(--page-max-width)] mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/varieties" element={<Varieties />} />
          <Route path="/growing" element={<Growing />} />
          <Route path="/nutrition" element={<Nutrition />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/safety" element={<Safety />} />
        </Routes>
      </main>
      {!chatOpen && <ChatLauncher onOpen={() => setChatOpen(true)} />}
      {chatOpen && (
        <ChatPanel messages={messages} onMessagesChange={setMessages} onClose={() => setChatOpen(false)} />
      )}
    </div>
  );
}
