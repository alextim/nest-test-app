import { resolve } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const publicDir = resolve(
          __dirname,
          configService.get<string>('server.publicDir'),
        );

        return [
          {
            rootPath: publicDir,
            // serveRoot - if you want to see files on another controller,
            // e.g.: http://localhost:8088/files/1.png
            // serveRoot: '/files',
            exclude: ['/files/*'],
          },
        ];
      },
    }),
  ],
})
export class NestServeStaticModule {}
