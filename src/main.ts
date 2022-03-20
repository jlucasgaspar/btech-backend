import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthInterceptor } from './common/interceptors/auth.interceptor';
import database from './database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Bolttech test')
    .setDescription('API documentation for bolttech backend test')
    .setVersion('1.0')
    .addTag('users')
    .addTag('projects')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalInterceptors(new AuthInterceptor());
  await database.connect();
  await app.listen(process.env.PORT || 3000);
}

bootstrap();