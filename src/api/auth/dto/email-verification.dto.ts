import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { TOKEN_LENGTH } from '../entities/token.entity';

export class EmailVerificationDto {
  @IsString()
  @Matches(/^[A-Za-z0-9]*$/)
  @Length(TOKEN_LENGTH, TOKEN_LENGTH)
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: true })
  token: string;
}
