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

import { hash, compare } from 'bcrypt';

import { BaseEntity } from '../../../shared/entities/BaseEntity';
import { Token } from '../../auth/entities/token.entity';
import { Transform } from 'class-transformer';
import { CrudValidationGroups } from '@nestjsx/crud';
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

  @PrimaryGeneratedColumn()
  id: number;

  @Length(2, 30, {
    always: true,
    message: 'The name must be at least 2 but not longer than 30 characters',
  })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: false })
  @Column({ length: 30, nullable: true })
  username?: string;

  @IsEmail({}, { always: true, message: 'Incorrect email' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE], message: 'The email is required' })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: true })
  @Column({ length: 254 })
  email: string;

  @Matches(User.PASSWORD_PATTERN, {
    message: User.PASSWORD_PATTERN_MESSAGE,
  })
  @Length(User.PASSWORD_MIN_LENGTH, User.PASSWORD_MAX_LENGTH, {
    message: User.PASSWORD_LENGTH_MESSAGE,
  })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE], message: 'The password is required' })
  @Transform(
    ({ value }) => {
      return value?.trim();
    },
    { toClassOnly: true },
  )
  @ApiProperty({ required: true })
  @Column({ length: User.PASSWORD_MAX_LENGTH })
  password: string;

  @IsEnum(Role, { always: true, each: true })
  @ArrayUnique({ always: true })
  @ArrayNotEmpty({ always: true })
  @IsArray({ always: true, message: 'The roles must be an array' })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE], message: 'Roles are required' })
  @ApiProperty({ required: true })
  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  roles: Role[];

  @MaxLength(40, { always: true })
  @IsString({ always: true })
  @IsOptional({ groups: [CREATE, UPDATE] })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: false })
  @Column({ name: 'first_name', length: 40, nullable: true })
  firstName?: string;

  @MaxLength(40, { always: true })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @Transform(({ value }) => value?.trim())
  @ApiProperty({ required: false })
  @Column({ name: 'last_name', length: 40, nullable: true })
  lastName?: string;

  @IsDate({ always: true })
  @MinDate(new Date(), { always: true })
  @Transform(({ value }) => value && new Date(value))
  @IsOptional({ always: true })
  @ApiProperty({ required: false })
  @Column({
    name: 'verification_sent_at',
    type: 'timestamptz',
    nullable: true,
  })
  verificationCodeSentAt?: Date;

  @IsDate({ always: true })
  @MinDate(new Date(), { always: true })
  @Transform(({ value }) => value && new Date(value))
  @IsOptional({ always: true })
  @ApiProperty({ required: false })
  @Column({ name: 'verified_at', type: 'timestamptz', nullable: true })
  verifiedAt?: Date;

  @OneToMany(() => Token, (token: Token) => token.user)
  public token: Token[];

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await User.hash(this.password);
  }

  static async hash(s: string) {
    return hash(s, HASH_ROUNDS);
  }

  async comparePasswords(plainPassword: string) {
    return compare(plainPassword, this.password);
  }

  getFullName() {
    let name = this.firstName || '';
    if (name && this.lastName) {
      name += `  ${this.lastName}`;
    }
    return name || this.username || this.email;
  }
}
