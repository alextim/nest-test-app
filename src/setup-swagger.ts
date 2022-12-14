import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import pkg from '../package.json';

export const setupSwagger = (app: INestApplication, configService: ConfigService) => {
    const swaggerOptions = new DocumentBuilder()
    .setTitle(configService.get<string>('APP_NAME'))
    .setDescription(pkg.description)
    .setVersion(pkg.version)
      .build();
  
  const document = SwaggerModule.createDocument(app, swaggerOptions, {
    ignoreGlobalPrefix: false,
  });

  SwaggerModule.setup('docs', app, document);
}