import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { Role, User } from '../entities/user.entity';

export class CreateUserDto {
  @ApiPropertyOptional()
  @Length(User.USERNAME_MIN_LENGTH, User.USERNAME_MAX_LENGTH, {
    message: User.USERNAME_LENGTH_MESSAGE,
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim().toLowerCase())
  public username?: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  public email: string;

  @ApiPropertyOptional()
  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  public password?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  public isRegisteredWithGoogle?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @Length(21, 21)
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  public googleId?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  public isRegisteredWithFacebook?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @Length(21, 21)
  @IsOptional()
  @Transform(({ value }) => value?.trim() || null)
  public facebookId?: string;

  @ApiProperty({
    isArray: true,
    enum: Role,
  })
  @IsEnum(Role, { each: true })
  @ArrayUnique()
  @ArrayNotEmpty()
  @IsArray({ message: 'The roles must be an array' })
  @IsNotEmpty()
  public roles: Role[];

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

  @ApiPropertyOptional()
  @MaxLength(20)
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  public phone?: string;

  @ApiPropertyOptional()
  //@MaxLength(100)
  // @IsString()
  @IsOptional()
  public avatarId?: number | null;

  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  @IsOptional()
  public verificationCodeSentAt?: Date;

  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => value && new Date(value))
  @IsOptional()
  public verifiedAt?: Date;
}
