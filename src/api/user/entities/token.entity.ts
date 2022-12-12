import {
  Entity,
  Unique,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import crypto from 'node:crypto';
import { IsNotEmpty, Length } from 'class-validator';

import { BaseEntity } from './BaseEntity';
import { User } from './user.entity';

export enum UserTokenEnum {
  ACCESS = 'access',
  REFRESH = 'refresh',
  PASSWORD_RECOVERY = 'password_recovery',
  VERIFICATION = 'verification',
}

@Entity({ name: 'token' })
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 350 })
  @IsNotEmpty({ message: 'The token value is required' })
  token: string;

  @Column({
    type: 'enum',
    enum: UserTokenEnum,
  })
  @IsNotEmpty({ message: 'The token type is required' })
  type: UserTokenEnum;

  @Column({
    name: 'expire_at',
    type: 'timestamp',
  })
  @IsNotEmpty({ message: 'The token expire date is required' })
  expireAt?: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

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

  toJSON() {
    return {
      ...this,
    };
  }
}
