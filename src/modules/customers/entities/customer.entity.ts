import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';
import { Job } from '../../jobs/entities/job.entity';
import { Schedule } from '../../schedules/entities/schedule.entity';

import { LinkedInProfile } from './linked-in-profile.entity';

@Entity()
export class Customer extends BaseEntity {
  @Column({ length: 40 })
  public firstName: string;

  @Column({ length: 40 })
  public lastName: string;

  @OneToMany(() => Schedule, (schedule) => schedule.customer)
  schedules: Schedule[];

  @OneToMany(() => Job, (job) => job.customer)
  jobs: Job[];

  @OneToOne(() => LinkedInProfile, (profile) => profile.customer, {
    cascade: true,
  })
  linkedInProfile: LinkedInProfile;
}
