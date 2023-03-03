import { ApiProperty } from '@nestjs/swagger';
import { Express } from 'express';
import 'multer';

export class MediaUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
