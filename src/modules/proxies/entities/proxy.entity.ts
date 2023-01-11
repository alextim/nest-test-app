import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Job } from '../../jobs/entities/job.entity';
import { Query } from '../../queries/entities/query.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

@Entity()
export class Proxy extends BaseEntity {
  @Column()
  name: string;

  @Column()
  token?: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  region: string;

  @Column()
  parallelScrapingJobLimit?: number;

  @Column()
  host?: string;

  @Column()
  port?: number;

  @OneToMany(() => Query, (q) => q.proxy)
  queries: Query[];

  @OneToMany(() => Schedule, (schedule) => schedule.proxy)
  schedules: Schedule[];

  @OneToMany(() => Job, (job) => job.proxy)
  jobs: Job[];
}
