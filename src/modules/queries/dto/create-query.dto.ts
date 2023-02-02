import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
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
  @IsInt()
  requestInterval: number;

  @ApiProperty()
  @IsInt()
  pageLoadDelay: number;

  @ApiProperty()
  @IsInt()
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
