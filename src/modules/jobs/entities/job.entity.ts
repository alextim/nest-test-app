import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { User } from '../../users/entities/user.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';
import { Query } from '../../queries/entities/query.entity';
import { Customer } from '../../customers/entities/customer.entity';

import { JobStatus } from './job-status.enum';



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

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.jobs)
  user: User;

  @Column({ nullable: true })
  proxyId?: number;
  @ManyToOne(() => Proxy, (proxy) => proxy.jobs)
  proxy?: Proxy;

  @Column()
  queryId: number;
  @ManyToOne(() => Query, (q) => q.jobs)
  query: Query;

  @Column()
  customerId: number;  
  @ManyToOne(() => Customer, (customer) => customer.jobs)
  customer: Customer;
}
