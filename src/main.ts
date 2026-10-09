import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './config/configuration';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AppConfig, true>);
  const logger = new Logger('Bootstrap');

  const port = configService.get('port', { infer: true });
  const environment = configService.get('environment', { infer: true });

  await app.listen(port);

  logger.log(`Application listening on port ${port} (${environment})`);
}

bootstrap().catch((error: unknown) => {
  new Logger('Bootstrap').error('Failed to start application', error instanceof Error ? error.stack : String(error));
  process.exit(1);
});
