import path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import type { Params } from 'nestjs-pino';
import pino from 'pino';
import type { SonicBoom } from 'sonic-boom';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Params => {
        let stream: SonicBoom;
        let transport: pino.TransportSingleOptions<Record<string, any>>;

        if (configService.get<boolean>('isProd')) {
          let dest: string;
          if (configService.get<boolean>('log.toFile')) {
            dest = path.join(
              configService.get<string>('log.dir'),
              configService.get<string>('log.filename'),
            );
          }

          stream = pino.destination({
            dest, // omit for stdout
            // There is a possibility of the most recently buffered log messages being lost in case of a system failure, e.g. a power cut.
            minLength: 4096, // Buffer before writing
            sync: false, // Asynchronous logging
            mkdir: true,
          });
        } else {
          transport = {
            target: 'pino-pretty',
            options: {
              colorize: true,
              levelFirst: true,
              singleLine: true,
              translateTime: 'HH:MM:ss',
            },
          };
        }

        return {
          pinoHttp: {
            customProps: () => ({
              context: 'HTTP',
            }),
            level: configService.get<string>('log.level'),
            redact: {
              remove: true,
              paths: [
                'pid',
                'hostname',
                'responseTime',
                'res.headers',
                'req.headers',
              ],
            },
            transport, // for development
            stream, // for production
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class NestPinoModule {}
