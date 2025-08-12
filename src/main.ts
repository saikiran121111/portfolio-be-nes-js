import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import { HEADER_VERSION } from './constants/headerVersion';
import { defaultVersionHeaderMiddleware } from './middleware/defaultVersionHeader.middleware';

// Load environment variables from the local .env file
config({ path: 'env/local/.env' });

function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API documentation for Portfolio project')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

function headerVersioning(app) {
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Version',
    defaultVersion: HEADER_VERSION,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});

  app.use(defaultVersionHeaderMiddleware);
  headerVersioning(app);
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
