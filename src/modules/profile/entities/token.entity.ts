import { Entity, Column, ManyToOne, RelationId } from 'typeorm';
import crypto from 'node:crypto';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinDate,
} from 'class-validator';

import { BaseEntity } from '../../../core/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';

export const TOKEN_LENGTH = 64;

export enum TokenType {
  PasswordReset = 'password_reset',
  EmailVerification = 'email_verification',
}

@Entity({ name: 'token' })
export class Token extends BaseEntity {
  @IsString()
  @Matches(/^[A-Za-z0-9]*$/)
  @Length(TOKEN_LENGTH, TOKEN_LENGTH)
  @IsNotEmpty({ message: 'The token value is required' })
  @Column({ length: TOKEN_LENGTH })
  token: string;

  @IsEnum(TokenType)
  @IsNotEmpty({ message: 'The token type is required' })
  @Column({
    type: 'enum',
    enum: TokenType,
  })
  type: TokenType;

  @IsDate()
  @MinDate(new Date())
  @Transform(({ value }) => value && new Date(value))
  @IsNotEmpty({ message: 'The token expiration date is required' })
  @Column({
    type: 'timestamptz',
  })
  expiresAt?: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @RelationId((token: Token) => token.user) // you need to specify target relation
  @Column()
  userId: number;

  constructor(token?: Partial<Token>) {
    super();
    Object.assign(this, token);
  }

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString('hex');

    const hashedVerificationCode = crypto
      .createHash('sha256')
      .update(verificationCode)
      .digest('hex');

    return { verificationCode, hashedVerificationCode };
  }
}
