import { ApiProperty } from '@nestjs/swagger';
import 'multer';
export class MediaUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
