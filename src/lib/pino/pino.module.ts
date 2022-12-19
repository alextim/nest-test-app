import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import type { Params } from 'nestjs-pino';
import pino from 'pino';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProd = configService.get<boolean>('isProd');

        const dest =
          configService.get<string>('LOG_TO_FILE') === 'true'
            ? `${configService.get<string>(
                'LOG_DIR',
              )}${configService.get<string>('LOG_FILENAME')}`
            : undefined;
        const stream = isProd
          ? pino.destination({
              dest, // omit for stdout
              // There is a possibility of the most recently buffered log messages being lost in case of a system failure, e.g. a power cut.
              minLength: 4096, // Buffer before writing
              sync: false, // Asynchronous logging
              mkdir: true,
            })
          : undefined;

        const transport = isProd
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                colorize: true,
                levelFirst: true,
                singleLine: true,
                translateTime: 'HH:MM:ss',
              },
            };

        const config: Params = {
          pinoHttp: {
            customProps: (req, res) => ({
              context: 'HTTP',
            }),
            level: configService.get<string>('LOG_LEVEL'),
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
            transport,
            stream,
          },
        };

        return config;
      },
    }),
  ],
  exports: [LoggerModule],
})
export class NestPinoModule {}
