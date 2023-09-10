import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // отбросит все поля не описаные в dtoы
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('КупиПодариДай')
    .setDescription('Сервис вишлистов')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api', app, document);

  app.enableCors();
  await app.listen(PORT, () => console.log(`Server started  on port ${PORT}`));
}
bootstrap();
