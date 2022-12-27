import { ApiProperty } from '@nestjs/swagger';

export class MediaUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
