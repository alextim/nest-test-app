import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WaitUntil } from '../entities/wait-until.enum';

import { Proxy } from '../../proxies/entities/proxy.entity';

export class CreateQueryDto {
  @ApiProperty()
  @MaxLength(20)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty()
  @MaxLength(200)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  startUrl: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isList?: boolean;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  itemCount?: number;

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

  @ApiPropertyOptional()
  //@MaxLength(100)
  // @IsString()
  @IsOptional()
  proxy: Proxy;
}
