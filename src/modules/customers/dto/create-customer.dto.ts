import {
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { CreateLinkedInProfileDto } from './linked-in-profile.dto';

export class CreateCustomerDto {
  @ApiProperty()
  @MaxLength(40)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public firstName: string;

  @ApiProperty()
  @MaxLength(40)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  public lastName: string;

  @ApiProperty()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateLinkedInProfileDto)
  linkedInProfile: CreateLinkedInProfileDto;
}
