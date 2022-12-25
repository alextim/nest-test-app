import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { Role } from '../entities/user.entity';

export class UserDto2 {
  @ApiPropertyOptional()
  @Transform(({ value }) => value || undefined)
  public username?: string;

  @ApiProperty()
  public email: string;

  @ApiPropertyOptional()
  public isRegisteredWithGoogle?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => value || undefined)
  public googleId?: string;

  @ApiPropertyOptional()
  public isRegisteredWithFacebook?: boolean;

  @ApiPropertyOptional()
  @Transform(({ value }) => value || undefined)
  public facebookId?: string;

  @ApiProperty({
    isArray: true,
    enum: Role,
  })
  public roles: Role[];

  @ApiPropertyOptional()
  @Transform(({ value }) => value || undefined)
  public firstName?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value || undefined)
  public lastName?: string;

  @Transform(({ value }) => value || undefined)
  public avatar?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value || undefined)
  public verificationCodeSentAt?: Date;

  @ApiPropertyOptional()
  @Transform(({ value }) => value || undefined)
  public verifiedAt?: Date;
}
