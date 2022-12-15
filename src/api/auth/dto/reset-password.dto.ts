import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { TOKEN_LENGTH } from '../entities/token.entity';
import { User } from 'src/api/users/entities/user.entity';

export class ResetPasswordDto {
  @IsString()
  @Matches(/^[A-Za-z0-9]*$/)
  @Length(TOKEN_LENGTH, TOKEN_LENGTH)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: true })
  token: string;

  @Matches(User.PASSWORD_PATTERN, { message: User.PASSWORD_PATTERN_MESSAGE })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: true })
  password: string;
}
