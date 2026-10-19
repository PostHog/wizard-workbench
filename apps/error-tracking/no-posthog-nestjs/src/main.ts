import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);

  await app.listen(port);
  Logger.log(`Listening on port ${port}`, 'Bootstrap');
}
void bootstrap();
