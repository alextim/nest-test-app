import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { QueryExists } from 'src/decorators/query-exists';
import { SelectorType } from '../entities/selector-type.enum';

export class CreateSelectorDto {
  @ApiProperty()
  @IsString()
  @MaxLength(20)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
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
  @QueryExists()
  @IsInt()
  @IsNotEmpty()
  queryId: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  parentId?: number;
}
