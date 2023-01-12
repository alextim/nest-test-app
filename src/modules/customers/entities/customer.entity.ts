import { ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

import { BaseEntity } from '../../../core/entities/BaseEntity';
import { Job } from '../../jobs/entities/job.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

import { LinkedInProfile } from './linked-in-profile.entity';

@Entity()
export class Customer extends BaseEntity {
  @ApiPropertyOptional()
  @MaxLength(40, { always: true })
  @IsString({ always: true })
  @IsOptional({ always: true })
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

  @OneToMany(() => Schedule, (schedule) => schedule.customer)
  schedules: Schedule[];

  @OneToMany(() => Job, (job) => job.customer)
  jobs: Job[];

  @OneToOne(() => LinkedInProfile, (profile) => profile.customer, {
    cascade: true,
  })
  linkedInProfile: LinkedInProfile;
}
