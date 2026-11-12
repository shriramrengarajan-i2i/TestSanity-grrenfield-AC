import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // No auth middleware, no session/cookie handling: every route stays reachable
  // by an anonymous visitor (RULE-0001, RULE-0003).
  app.enableCors({ origin: true });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
