import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ParserType } from '../entities/parser-type.enum';

export class CreateParserDto {
  @ApiProperty()
  @IsEnum(ParserType)
  @IsNotEmpty()
  parserType: ParserType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  /**
   * replaceText
   */
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isRegex?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(64)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  pattern?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(64)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  replacement?: string;

  /**
   * addText
   */
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(64)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  append?: string;

  @ApiPropertyOptional()
  @IsString()
  @MaxLength(64)
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  prepend?: string;

  /**
   * Strip HTML
   */
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  stripHtmlTags?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  decodeHtmlEntities?: boolean;

  /**
   * RemoveWhitespaces
   */
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  removeWhitespaces?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  removeNewlines?: boolean;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  selectorId: number;
}
