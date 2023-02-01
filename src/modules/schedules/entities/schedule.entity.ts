import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { User } from '../../users/entities/user.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';
import { Query } from '../../queries/entities/query.entity';
import { Customer } from '../../customers/entities/customer.entity';

import { Timezone } from './timezone.entity';
import { DailyWeekdays, IntervalType, SchedulerType } from './schedule.types';

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

  @Column()
  cronEnabled?: boolean;

  @Column({ default: 0 })
  timezoneId: number;
  @ManyToOne(() => Timezone, (tz) => tz.schedules, { onDelete: 'CASCADE' })
  timezone: Timezone;

  @Column({
    enum: SchedulerType,
    default: SchedulerType.Daily,
  })
  schedulerType: SchedulerType;

  /**
   * daily
   */
  @Column('boolean', {
    array: true,
    default: [true, true, true, true, true, true, true],
  })
  dailyWeekdays: DailyWeekdays;

  @Column('time', { default: '14:30' })
  dailyTime: string;

  /**
   * interval
   */
  @Column('smallint', { default: 12 })
  interval: number;

  @Column({
    enum: IntervalType,
    default: IntervalType.Hour,
  })
  intervalType: IntervalType;

  /**
   * custom
   */
  @Column({
    length: 40,
    default: '*',
  })
  minute: string;

  @Column({
    length: 40,
    default: '*',
  })
  @Column({
    length: 40,
    default: '*',
  })
  hour: string;

  @Column({
    length: 40,
    default: '*',
  })
  dayOfMonth: string;

  @Column({
    length: 40,
    default: '*',
  })
  month: string;

  @Column({
    length: 40,
    default: '*',
  })
  dayOfWeek: string;
}
