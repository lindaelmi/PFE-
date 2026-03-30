import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour les routes (ex: /api/hotels)
  app.setGlobalPrefix('api');

  // Configuration CORS : autorise le frontend Netlify et localhost (développement)
  app.enableCors({
    origin: ['https://bookinglili.netlify.app', 'http://localhost:4200'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
  console.log(`✅ Backend démarré sur http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();