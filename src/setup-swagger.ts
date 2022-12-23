import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import pkg from '../package.json';

export const setupSwagger = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const cookieName = configService.get<string>('session.cookieName');

  const loginUrl = `${configService.get<string>(
    'baseUrl',
  )}${configService.get<string>('urlPrefix')}/auth/login`;

  const swaggerOptions = new DocumentBuilder()
    .setTitle(configService.get<string>('appName'))
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .addCookieAuth(cookieName)
    .addOAuth2({
      type: 'oauth2',
      name: 'Google',
      flows: {
        implicit: {
          authorizationUrl: `${loginUrl}/google`,
          scopes: {},
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('docs', app, document);
};
