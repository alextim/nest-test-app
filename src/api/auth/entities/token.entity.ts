import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  RelationId,
} from 'typeorm';
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

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { User } from '../../users/entities/user.entity';

export const TOKEN_LENGTH = 256;

export enum TokenType {
  PasswordReset = 'password_reset',
  EmailVerification = 'email_verification',
}

@Entity({ name: 'token' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
    name: 'expires_at',
    type: 'timestamptz',
  })
  expiresAt?: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @RelationId((token: Token) => token.user) // you need to specify target relation
  @Column({
    name: 'user_id',
  })
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
