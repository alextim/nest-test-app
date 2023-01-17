import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WaitUntil } from '../entities/wait-until.enum';

import { Proxy } from '../../proxies/entities/proxy.entity';

export class CreateQueryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
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

  @ApiProperty()
  //@MaxLength(100)
  // @IsString()
  @IsNotEmpty()
  proxy: Proxy;
}
