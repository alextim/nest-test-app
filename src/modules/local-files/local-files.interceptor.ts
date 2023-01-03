import { FileInterceptor } from '@nestjs/platform-express';
import {
  Injectable,
  mixin,
  NestInterceptor,
  Type,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import path from 'node:path';
import { getRandomFilename } from './get-random-filename';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

export function fileMimetypeFilter(
  ...mimetypes: string[]
): MulterOptions['fileFilter'] {
  return (req, file, cb) => {
    if (mimetypes.some((m) => file.mimetype.includes(m))) {
      cb(null, true);
    } else {
      cb(
        new UnsupportedMediaTypeException(
          `File type is not matching: ${mimetypes.join(', ')}`,
        ),
        false,
      );
    }
  };
}

const imageFileFilter = fileMimetypeFilter('image');

const IMAGES_SUBDIR = 'images';

function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const destination = path.join(
        configService.get<string>('uploads.dir'),
        options.path || IMAGES_SUBDIR,
      );

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (req, file, cb) => cb(null, getRandomFilename(file.originalname)),
        }),

        fileFilter: options.fileFilter || imageFileFilter,

        limits: options.limits || {
          fileSize: configService.get<number>('uploads.maxFileSize'),
          files: 1,
        },
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}

export default LocalFilesInterceptor;
