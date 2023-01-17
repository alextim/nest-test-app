import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SelectorType } from '../entities/selector-type.enum';

export class CreateSelectorDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  selector: string;

  @ApiProperty()
  @IsEnum(SelectorType)
  @IsNotEmpty()
  type: SelectorType;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  multiply?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  queryId: number;
}
