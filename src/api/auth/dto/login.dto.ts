import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim().toLowerCase())
  @ApiProperty({ required: true })
  email: string;

  @Matches(User.PASSWORD_PATTERN)
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: true })
  password: string;
}
