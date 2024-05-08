import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'log'],
    rawBody: true,
  });

  const config = new DocumentBuilder().setTitle('Block list').build()

  const document = SwaggerModule.createDocument(app,config)

  SwaggerModule.setup('api',app,document)

  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  
  app.enableCors({
    origin: "http://localhost:4200",
    credentials: true
  })
  const configService = app.get(ConfigService);

  await app.listen(configService.get('GLOBAL.PORT'));
  // const app = await NestFactory.create(AppModule, { rawBody: true });

  // const configService = app.get(ConfigService);

  // await app.listen(configService.get('GLOBAL.PORT'));
}
bootstrap();
