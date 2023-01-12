import {
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { CreateLinkedInProfileDto } from './linked-in-profile.dto';

export class CreateCustomerDto {
  @ApiPropertyOptional()
  @MaxLength(40)
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  public firstName?: string;

  @ApiPropertyOptional()
  @MaxLength(40)
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  public lastName?: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateLinkedInProfileDto)
  linkedInProfile: CreateLinkedInProfileDto;
}
