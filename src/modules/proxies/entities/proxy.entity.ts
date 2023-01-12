import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Job } from '../../jobs/entities/job.entity';
import { Query } from '../../queries/entities/query.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Unique('UQ_proxy_name', ['name'])
@Entity()
export class Proxy extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  token?: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  @Column({ length: 2, nullable: true })
  region?: string;

  @IsNumber()
  @IsOptional()
  @Column({ default: 0, nullable: true })
  parallelScrapingJobLimit?: number;

  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  host?: string;

  @IsNumber()
  @IsOptional()
  @Column({ nullable: true })
  port?: number;

  @OneToMany(() => Query, (q) => q.proxy)
  queries: Query[];

  @OneToMany(() => Schedule, (schedule) => schedule.proxy)
  schedules: Schedule[];

  @OneToMany(() => Job, (job) => job.proxy)
  jobs: Job[];
}
