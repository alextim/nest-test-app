import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';

import { User } from '../../users/entities/user.entity';
import { TOKEN_LENGTH } from '../entities/token.entity';

export class ResetPasswordDto {
  @ApiProperty({ required: true })
  @IsString()
  @Matches(/^[A-Za-z0-9]*$/)
  @Length(TOKEN_LENGTH, TOKEN_LENGTH)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  token: string;

  @ApiProperty({ required: true })
  @Matches(User.PASSWORD_PATTERN, { message: User.PASSWORD_PATTERN_MESSAGE })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  password: string;
}
