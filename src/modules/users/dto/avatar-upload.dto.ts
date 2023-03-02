import { ApiProperty } from '@nestjs/swagger';
import 'multer';
export class AvatarUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
