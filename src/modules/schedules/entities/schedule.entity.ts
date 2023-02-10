import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { User } from '../../users/entities/user.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';
import { Query } from '../../queries/entities/query.entity';
import { Customer } from '../../customers/entities/customer.entity';

import { Timezone } from '../../timezones/entities/timezone.entity';
import { IntervalType, SchedulerType } from './schedule.types';

@Entity()
export class Schedule extends BaseEntity {
  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.schedules)
  user: User;

  @Column()
  queryId: number;
  @ManyToOne(() => Query, (q) => q.schedules)
  query: Query;

  @Column()
  customerId: number;
  @ManyToOne(() => Customer, (customer) => customer.schedules)
  customer: Customer;

  @Column({ nullable: true })
  schedulerEnabled?: boolean;

  @Column()
  requestInterval: number;

  @Column()
  pageLoadDelay: number;

  @Column()
  timeout: number;

  @Column({ nullable: true })
  proxyId?: number;
  @ManyToOne(() => Proxy, (proxy) => proxy.schedules)
  proxy: Proxy;

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
