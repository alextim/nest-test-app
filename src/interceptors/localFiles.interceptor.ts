import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import path from 'node:path';

const geRandomFilename = (filename: string) => {
  const random = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const { name, ext } = path.parse(filename);
  return `${name}-${random}${ext}`;
};
 
interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}
 
function LocalFilesInterceptor (options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
 
      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: path.join(
            configService.get<string>('server.uploadsDir'),
            options.path,
          ),
          filename: (req, file, cb) => cb(null, geRandomFilename(file.originalname)),
        }),
        fileFilter: options.fileFilter,
        limits: options.limits
      }
 
      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions));
    }
 
    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}
 
export default LocalFilesInterceptor;