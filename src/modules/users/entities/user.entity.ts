import {
  Entity,
  Unique,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Transform } from 'class-transformer';

import { hash, compare } from '../../../shared/hash';

import { BaseEntity } from '../../../core/entities/BaseEntity';
import { Token } from '../../profile/entities/token.entity';
import { LocalFile } from '../../local-files/entities/local-file.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';
import { Job } from '../../jobs/entities/job.entity';
import { Post } from '../../posts/entities/post.entity';

import { Role } from './role.enum';

@Unique('UQ_user_username', ['username'])
@Unique('UQ_user_email', ['email'])
@Entity({ name: 'user' })
export class User extends BaseEntity {
  static readonly USERNAME_MIN_LENGTH = 2;
  static readonly USERNAME_MAX_LENGTH = 30;
  static readonly USERNAME_LENGTH_MESSAGE =
    'The username must be at least $constraint1 but not longer than $constraint2 characters';

  static readonly PASSWORD_MIN_LENGTH = 8;
  static readonly PASSWORD_MAX_LENGTH = 128;
  static readonly PASSWORD_LENGTH_MESSAGE =
    'The password must be at least $constraint1 but not longer than $constraint2 characters';

  static readonly PASSWORD_PATTERN =
    /^(?=.*\d)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[()[\]{}<>`~!@#№%$^&*\-_=+:;"'\\|,.?/]).{8,}$/;
  static readonly PASSWORD_PATTERN_MESSAGE =
    'Password must contain at least 1 lowercase, 1 uppercase, 1 digit and 1 special char';

  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ length: User.USERNAME_MAX_LENGTH, nullable: true })
  public username?: string;

  @Transform(({ value }) => value?.trim().toLowerCase(), { toClassOnly: true })
  @Column({ length: 254 })
  public email: string;

  @Transform(({ value }) => value?.trim(), { toClassOnly: true })
  @Column({ length: User.PASSWORD_MAX_LENGTH, nullable: true })
  public password?: string;

  @Column({ default: false })
  public isRegisteredWithGoogle?: boolean;

  @Column({ length: 21, nullable: true })
  public googleId?: string;

  @Column({ default: false })
  public isRegisteredWithFacebook?: boolean;

  @Column({ length: 21, nullable: true })
  public facebookId?: string;

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

  @Transform(({ value }) => (value ? value.trim() : undefined))
  @Column({ length: 40, nullable: true })
  public firstName?: string;

  @Transform(({ value }) => (value ? value.trim() : undefined))
  @Column({ length: 40, nullable: true })
  public lastName?: string;

  @Transform(({ value }) => (value ? value.trim() : undefined))
  @Column({ length: 20, nullable: true })
  public phone?: string;

  @Column({ nullable: true })
  public avatarId?: number | null;

  @OneToOne(() => LocalFile, {
    cascade: true,
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn()
  avatar: LocalFile;

  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public verificationCodeSentAt?: Date;

  @Transform(({ value }) => value || undefined, { toPlainOnly: true })
  @Column({ type: 'timestamptz', nullable: true })
  public verifiedAt?: Date;

  @OneToMany(() => Token, (token) => token.user)
  public token: Token[];

  @OneToMany(() => Schedule, (schedule) => schedule.user)
  schedules: Schedule[];

  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  constructor(user?: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  public static isAdmin(user: User) {
    return user.roles.some((role) => role === Role.ADMIN);
  }

  private isHashed = false;

  public setPassword(plainPassword: string) {
    this.password = plainPassword;
    this.isHashed = false;
  }

  @BeforeInsert()
  @BeforeUpdate()
  public async hashPassword() {
    if (this.password && !this.isHashed) {
      this.password = await hash(this.password);
      this.isHashed = true;
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
