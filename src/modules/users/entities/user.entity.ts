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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CrudValidationGroups } from '@nestjsx/crud';
import { Transform } from 'class-transformer';
import { hash, compare } from 'bcrypt';

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { Token } from '../../account/entities/token.entity';

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
  static readonly USERNAME_MIN_LENGTH = 2;
  static readonly USERNAME_MAX_LENGTH = 30;
  static readonly USERNAME_LENGTH_MESSAGE = 'The username must be at least $constraint1 but not longer than $constraint2 characters';

  static readonly PASSWORD_MIN_LENGTH = 8;
  static readonly PASSWORD_MAX_LENGTH = 128;
  static readonly PASSWORD_LENGTH_MESSAGE = 'The password must be at least $constraint1 but not longer than $constraint2 characters';

  static readonly PASSWORD_PATTERN =
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  static readonly PASSWORD_PATTERN_MESSAGE =
    'Password must contain at least 1 lowercase, 1 uppercase, 1 digit and 1 special char';

  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  public id: number;

  @ApiPropertyOptional()
  @Length(User.USERNAME_MIN_LENGTH, User.USERNAME_MAX_LENGTH, {
    always: true,
    message: User.USERNAME_LENGTH_MESSAGE,
  })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ length: User.USERNAME_MAX_LENGTH, nullable: true })
  public username?: string;

  @ApiPropertyOptional()
  @IsEmail({}, { always: true, message: 'Incorrect email' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE], message: 'The email is required' })
  @Transform(({ value }) => value?.trim().toLowerCase(), { toClassOnly: true })
  @Column({ length: 254 })
  public email: string;

  @ApiPropertyOptional()
  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsOptional({ always: true })
  @Transform(({ value }) => value?.trim(), { toClassOnly: true })
  @Column({ length: User.PASSWORD_MAX_LENGTH, nullable: true })
  public password?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional({ always: true })
  @Column({ default: false })
  public isRegisteredWithGoogle?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @Length(21, 21, { always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ length: 21, nullable: true })
  public googleId?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional({ always: true })
  @Column({ default: false })
  public isRegisteredWithFacebook?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @Length(21, 21, { always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ length: 21, nullable: true })
  public facebookId?: string;

  @ApiProperty({
    isArray: true,
    enum: Role,
  })
  @IsEnum(Role, { always: true, each: true })
  @ArrayUnique({ always: true })
  @ArrayNotEmpty({ always: true })
  @IsArray({ always: true, message: 'The roles must be an array' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE], message: 'Roles are required' })
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

  @ApiPropertyOptional()
  @MaxLength(40, { always: true })
  @IsString({ always: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Transform(({ value }) => (value ? value.trim() : undefined))
  @Column({ length: 40, nullable: true })
  public firstName?: string;

  @ApiPropertyOptional()
  @MaxLength(40, { always: true })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => (value ? value.trim() : undefined))
  @Column({ length: 40, nullable: true })
  public lastName?: string;

  @ApiPropertyOptional({ type: 'file' })
  @MaxLength(100, { always: true })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined)
  @Column({ length: 100, nullable: true })
  public avatar?: string;

  @ApiPropertyOptional()
  @IsDate({ always: true })
  @MinDate(new Date(), { always: true })
  @Transform(({ value }) => value && new Date(value))
  @IsOptional({ always: true })
  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public verificationCodeSentAt?: Date;

  @ApiPropertyOptional()
  @IsDate({ always: true })
  @MinDate(new Date(), { always: true })
  @Transform(({ value }) => value && new Date(value))
  @IsOptional({ always: true })
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
