import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // URL do frontend
    credentials: true, // Permite envio de cookies
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se houver props extras
      transform: true, // Transforma os dados para o tipo do DTO
    }),
  );

  app.setGlobalPrefix('api'); // Todas as rotas começam com /api

  const port = process.env.PORT || 3333;
  await app.listen(port);

  console.log('🚀 Servidor rodando em http://localhost:' + port);
}

bootstrap();