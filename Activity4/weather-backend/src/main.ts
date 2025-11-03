import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('🌤 Weather Proxy API Dashboard')
    .setDescription('Custom Swagger UI that fetches weather data from OpenWeatherMap API.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(process.env.PORT || 3001); // ✅ ensure port is set
  console.log(`🚀 Swagger UI available at: http://localhost:${process.env.PORT || 3001}/api`);
}

bootstrap();
