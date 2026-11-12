import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';

@Module({
  // No AuthModule, no @nestjs/passport, no APP_GUARD: this app has no
  // sign-in/session surface anywhere (REQ-120, RULE-0001).
  imports: [],
  controllers: [HealthController, ChatController],
  providers: [ChatService],
})
export class AppModule {}
