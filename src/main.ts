import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { useContainer, ValidationError } from 'class-validator';

import pkg from '../package.json';
import { AppModule } from './app.module';

import { HttpExceptionFilter } from './filters/http.filter';
import { FallbackExceptionFilter } from './filters/fallback.filter';
import { ValidationFilter } from './filters/validation.filter';
import { ValidationException } from './filters/validation.exception';
import { QueryErrorFilter } from './filters/query-error.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1', { exclude: ['/'] });
  /*
     app.useGlobalFilters(
        new FallbackExceptionFilter(),
        new HttpExceptionFilter(),
        new ValidationFilter()
    );
*/
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new QueryErrorFilter(httpAdapter));

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT');
  const hostname = config.get<string>('HOSTNAME');

  app.useGlobalPipes(
    new ValidationPipe({
      //transform: true,
      whitelist: true,
      //stopAtFirstError: false,
      enableDebugMessages: true,
      //forbidUnknownValues: false,
      // forbidNonWhitelisted: true,
      validationError: {
        target: true,
        value: true,
      },
      /*
      exceptionFactory: (errors: ValidationError[]) => {
          console.error(JSON.stringify(errors));

            const messages = errors.map(
                error=> `${error.property} has wrong value ${error.value},
                ${Object.values(error.constraints).join(', ')} `
            );

        return new ValidationException(errors);
        // return new BadRequestException(errors);
        }
        */

      // skipMissingProperties: true,
      /*
      forbidUnknownValues: true,
      validationError: { target: false }
      */

      // validatorPackage: require('class-validator'),
      // transformerPackage: require('class-transformer'),
      // forbidUnknownValues: false,

      // forbidNonWhitelisted: true,
      //transformOptions: {
      //  enableImplicitConversion: true,
      //},
    }),
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle(config.get<string>('APP_NAME'))
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions, {
    ignoreGlobalPrefix: false,
  });
  SwaggerModule.setup('docs', app, document);

  app.enableShutdownHooks();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(port, hostname, undefined);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap().catch((err) => {
  console.error(`Fatal error during initialization:`, err);
  process.exit(1);
});
