import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import { ConfigModule } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});
  await app.listen(3000);
}
bootstrap();
