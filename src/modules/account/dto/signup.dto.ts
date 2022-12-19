import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class SignupDto {
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: true })
  email: string;

  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsNotEmpty({ message: 'The password is required' })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: true })
  password: string;
}
