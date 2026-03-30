import 'dotenv/config';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response/response.interceptor';
import { HttpExceptionFilter } from './common/filters//http-exception/http-exception.filter';
import { AllExceptionFilter } from './common/filters/all-exception/all-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('DB URL:', process.env.DATABASE_URL);

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
