// https://github.com/nestjsx/crud/issues/74
import path from 'node:path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';


const geRandomFilename = (filename: string) => {
  const random = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  const { name, ext } = path.parse(filename);
  return `${name}-${random}${ext}`;
};

const IMAGE_MIME_TYPES = ['image/avif', 'image/jpeg', 'image/png', 'image/webp'];
const UPLOAD_FILE_SIZE = 1024 * 1024;
const DESTINATION_SUB_DIR = 'images';

const multerOptions = (destination: string, fileSize: number, supportedMimeTypes: string[]): MulterOptions => ({
  limits: {
    files: 1,
    fileSize,
  },      
  
  storage: diskStorage({
    destination: (req, file, cb) => cb(null, path.resolve('.', 'public', 'uploads', destination)),
    filename: (req, file, cb) =>
      cb(null, geRandomFilename(file.originalname)),
  }),

  fileFilter(req, file, cb) {
    if (!supportedMimeTypes.some((mimetype) => mimetype === file.mimetype)) {
      cb(new BadRequestException(`Unsupported file type ${path.extname(file.originalname)}`), false);
    } else {
      cb(null, true);
    }
  },
});   


export class FileUploadingUtils {
  static singleFileUploader(
    fieldName: string,
    destination = DESTINATION_SUB_DIR,
    fileSize = UPLOAD_FILE_SIZE,
    supportedMimeTypes = IMAGE_MIME_TYPES,
  ) {
    return FileInterceptor(fieldName, multerOptions(destination, fileSize, supportedMimeTypes));
  }

  static multipleFileUploader(
    fieldName: string,
    destination = DESTINATION_SUB_DIR,
    fileSize = UPLOAD_FILE_SIZE,
    supportedMimeTypes = IMAGE_MIME_TYPES,
    maxFileNumber = 10,
  ) {
    return FilesInterceptor(fieldName, maxFileNumber, multerOptions(destination, fileSize, supportedMimeTypes));
  }
}
