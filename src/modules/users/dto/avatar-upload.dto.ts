import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AvatarUploadDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  test?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  test2: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  image: Express.Multer.File;
}
