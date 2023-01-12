import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WaitUntil } from '../entities/wait-until.enum';

export class CreateQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startUrl: string;

  @ApiProperty()
  @IsNumber()
  requestInterval: number;

  @ApiProperty()
  @IsNumber()
  pageLoadDelay: number;

  @ApiProperty()
  @IsNumber()
  timeout: number;

  @ApiProperty()
  @IsEnum(WaitUntil)
  @IsNotEmpty()
  waitUntil: WaitUntil;
}
