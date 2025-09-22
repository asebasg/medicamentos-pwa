import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remover propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades extras
    transform: true, // Transforma el payload a la instancia del DTO
  }));
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
