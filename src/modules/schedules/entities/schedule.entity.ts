import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { User } from '../../users/entities/user.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';
import { Query } from '../../queries/entities/query.entity';
import { Customer } from '../../customers/entities/customer.entity';

import { Timezone } from './timezone.entity';
import { IntervalType, SchedulerType } from './schedule.types';

@Entity()
export class Schedule extends BaseEntity {
  @Column()
  requestInterval: number;

  @Column()
  pageLoadDelay: number;

  @Column()
  timeout: number;

  @Column()
  queryId: number;
  @ManyToOne(() => Query, (q) => q.schedules)
  query: Query;

  @Column({ nullable: true })
  proxyId?: number;
  @ManyToOne(() => Proxy, (proxy) => proxy.schedules)
  proxy: Proxy;

  @Column()
  customerId: number;
  @ManyToOne(() => Customer, (customer) => customer.schedules)
  customer: Customer;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.schedules)
  user: User;

  @Column({ nullable: true })
  cronEnabled?: boolean;

  @Column({ nullable: true })
  timezoneId?: number;
  @ManyToOne(() => Timezone, (tz) => tz.schedules, { onDelete: 'CASCADE' })
  timezone?: Timezone;

  @Column({
    enum: SchedulerType,
    nullable: true,
  })
  schedulerType?: SchedulerType;

  /**
   * daily
   */
  @Column('smallint', {
    array: true,
    nullable: true,
  })
  dailyWeekdays?: number[];

  @Column('time', { nullable: true })
  dailyTime?: string;

  /**
   * interval
   */
  @Column('smallint', { nullable: true })
  interval?: number;

  @Column({
    enum: IntervalType,
    nullable: true,
  })
  intervalType?: IntervalType;

  /**
   * custom
   */
  @Column({
    length: 200,
    nullable: true,
  })
  cron?: string;
}
