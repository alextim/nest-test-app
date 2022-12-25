import { IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Transform } from 'class-transformer';

export class ChangePasswordDto {
  @ApiProperty()
  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  oldPassword: string;

  @ApiProperty()
  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  newPassword: string;
}
