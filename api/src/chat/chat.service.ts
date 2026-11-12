import { Injectable } from '@nestjs/common';

export interface ChatReply {
  reply: string;
}

@Injectable()
export class ChatService {
  // Stub reply only: real RAG/LLM generation and conversational quality are
  // owned by the ai-chatbot feature work orders, not this one.
  reply(message: string): ChatReply {
    return {
      reply: `Thanks for your message: "${message}". The full assistant is being wired up separately.`,
    };
  }
}
