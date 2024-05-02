import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error', 'log']
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

  await app.listen(3000);
}
bootstrap();
