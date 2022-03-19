import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';
import database from './database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalInterceptors(new AuthInterceptor());
  await database.connect();
  await app.listen(process.env.PORT || 3000);
}

bootstrap();