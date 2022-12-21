import {
  Entity,
  Unique,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinDate,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Transform } from 'class-transformer';
import { hash, compare } from 'bcrypt';

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { Token } from '../../account/entities/token.entity';
import { BadRequestException } from '@nestjs/common';

const { CREATE, UPDATE } = CrudValidationGroups;

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

const HASH_ROUNDS = 8;

@Unique('UQ_user_username', ['username'])
@Unique('UQ_user_email', ['email'])
@Entity({ name: 'user' })
export class User extends BaseEntity {
  static readonly PASSWORD_MIN_LENGTH = 8;
  static readonly PASSWORD_MAX_LENGTH = 128;
  static readonly PASSWORD_LENGTH_MESSAGE = `The password must be at least ${User.PASSWORD_MIN_LENGTH} but not longer than ${User.PASSWORD_MAX_LENGTH} characters`;
  static readonly PASSWORD_PATTERN =
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  static readonly PASSWORD_PATTERN_MESSAGE =
    'Password must contain at least 1 lowercase, 1 uppercase, 1 digit and 1 special char';

  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  public id: number;

  @Length(2, 30, {
    always: true,
    message: 'The name must be at least 2 but not longer than 30 characters',
  })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @ApiProperty({ required: false })
  @Column({ length: 30, nullable: true })
  public username?: string;

  @IsEmail({}, { always: true, message: 'Incorrect email' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE], message: 'The email is required' })
  @Transform(({ value }) => value?.trim().toLowerCase(), { toClassOnly: true })
  @ApiProperty({ required: true })
  @Column({ length: 254 })
  public email: string;

  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsOptional({ always: true })
  @Transform(({ value }) => value?.trim(), { toClassOnly: true })
  @ApiProperty({ required: true })
  @Column({ length: User.PASSWORD_MAX_LENGTH, nullable: true })
  public password?: string;

  @IsBoolean()
  @IsOptional({ always: true })
  @Column({ default: false })
  public isRegisteredWithGoogle: boolean;

  @IsString()
  @Length(21, 21, { always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ length: 21, nullable: true })
  public googleId: string;

  @IsBoolean()
  @IsOptional({ always: true })
  @Column({ default: false })
  public isRegisteredWithFacebook: boolean;

  @IsString()
  @Length(21, 21, { always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ length: 21, nullable: true })
  public facebookId: string;

  @IsEnum(Role, { always: true, each: true })
  @ArrayUnique({ always: true })
  @ArrayNotEmpty({ always: true })
  @IsArray({ always: true, message: 'The roles must be an array' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE], message: 'Roles are required' })
  @ApiProperty({
    required: true,
    isArray: true,
    enum: Role,
  })
  @Transform(
    ({ value }) => {
      if (!value || Array.isArray(value) || typeof value !== 'string') {
        return value;
      }
      if (value.includes(',')) {
        return value.split(',').map((key) => key.trim());
      }
      return [value.trim()];
    },
    { toClassOnly: true },
  )
  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  public roles: Role[];

  @MaxLength(40, { always: true })
  @IsString({ always: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Transform(({ value }) => (value ? value.trim() : undefined))
  @ApiProperty({ required: false })
  @Column({ length: 40, nullable: true })
  public firstName?: string;

  @MaxLength(40, { always: true })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => (value ? value.trim() : undefined))
  @ApiProperty({ required: false })
  @Column({ length: 40, nullable: true })
  public lastName?: string;

  @MaxLength(100, { always: true })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined)
  @ApiProperty({ required: false })
  @Column({ length: 100, nullable: true })
  public avatar?: string;

  @IsDate({ always: true })
  @MinDate(new Date(), { always: true })
  @Transform(({ value }) => value && new Date(value))
  @IsOptional({ always: true })
  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public verificationCodeSentAt?: Date;

  @IsDate({ always: true })
  @MinDate(new Date(), { always: true })
  @Transform(({ value }) => value && new Date(value))
  @IsOptional({ always: true })
  @ApiProperty({ required: false })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ type: 'timestamptz', nullable: true })
  public verifiedAt?: Date;

  @OneToMany(() => Token, (token: Token) => token.user)
  public token: Token[];

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  public static async hash(s: string) {
    return hash(s, HASH_ROUNDS);
  }

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword() {
    if (this.password) {
      this.password = await User.hash(this.password);
      return;
    }
    if (!this.isRegisteredWithFacebook && !this.isRegisteredWithGoogle) {
      throw new BadRequestException('The password must not be empty to hash');
    }
  }

  public async comparePasswords(plainPassword: string) {
    return compare(plainPassword, this.password);
  }

  public get fullName() {
    if (!this.lastName) {
      return this.firstName || '';
    }
    if (!this.firstName) {
      return this.lastName;
    }
    return `${this.firstName} ${this.lastName}`;
  }
}
