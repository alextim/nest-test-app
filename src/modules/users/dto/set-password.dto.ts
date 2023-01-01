import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

import { User } from '../entities/user.entity';

export class SetPasswordDto {
  @ApiProperty()
  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  password: string;
}
