import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { VersioningType, INestApplication } from '@nestjs/common';
import { HEADER_VERSION } from './constants/headerVersion';
import { defaultVersionHeaderMiddleware } from './middleware/defaultVersionHeader.middleware';

function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('API documentation for Portfolio project')
    .setVersion('1.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
}

function headerVersioning(app: INestApplication): void {
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'Version',
    defaultVersion: HEADER_VERSION,
  });
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(defaultVersionHeaderMiddleware);
  headerVersioning(app);
  setupSwagger(app);

  const port = parseInt(process.env.PORT ?? '3002', 10);
  await app.listen(port, '0.0.0.0');

  console.log(`Server listening on 0.0.0.0:${port}`);
}

void bootstrap();
