import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { User } from '../../users/entities/user.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';

import { Query } from '../../queries/entities/query.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum JobStatus {
  Waiting = 'waiting',
  Running = 'running',
  Stopping = 'stopping',
  Stopped = 'stopped',
  Aborted = 'aborted',
  Success = 'success',
  Fail = 'fail',
}

@Entity()
export class Job extends BaseEntity {
  @Column()
  requestInterval: number;

  @Column()
  pageLoadDelay: number;

  @Column()
  timeout: number;

  @Column({ enum: JobStatus, default: JobStatus.Waiting })
  status: JobStatus;

  @ManyToOne(() => User, (user) => user.jobs)
  user: User;

  @ManyToOne(() => Proxy, (proxy) => proxy.jobs)
  proxy?: Proxy;

  @ManyToOne(() => Query, (q) => q.jobs)
  query: Query;

  @ManyToOne(() => Customer, (customer) => customer.jobs)
  customer: Customer;
}
