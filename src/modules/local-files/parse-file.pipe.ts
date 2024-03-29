// https://notiz.dev/blog/type-safe-file-uploads
import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';
import 'multer';

@Injectable()
export class ParseFile implements PipeTransform {
  transform(
    files: Express.Multer.File | Express.Multer.File[],
    _: ArgumentMetadata,
  ): Express.Multer.File | Express.Multer.File[] {
    if (
      files === undefined ||
      files === null ||
      (Array.isArray(files) && files.length === 0)
    ) {
      throw new BadRequestException('Validation failed (file expected)');
    }
    return files;
  }
}
