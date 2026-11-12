import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

class ChatRequestDto {
  message!: string;
}

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  send(@Body() body: ChatRequestDto) {
    return this.chatService.reply(body?.message ?? '');
  }
}
