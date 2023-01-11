import { IsBoolean } from 'class-validator';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { User } from '../../users/entities/user.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';

import { Query } from '../../queries/entities/query.entity';
import { Customer } from '../../customers/entities/customer.entity';

enum SchedulerType {
  Daily = 'daily',
  Interval = 'interval',
  Custom = 'custom',
}

enum IntervalType {
  Minute = 'minute',
  Hour = 'hour',
}

type Weekdays = [boolean, boolean, boolean, boolean, boolean, boolean, boolean];

@Unique('UQ_schedule_name', ['name'])
@Entity()
export class Schedule extends BaseEntity {
  @Column()
  name: string;

  @Column()
  requestInterval: number;

  @Column()
  pageLoadDelay: number;

  @Column()
  timeout: number;

  @ManyToOne(() => Proxy, (proxy) => proxy.schedules)
  proxy: Proxy;

  @Column()
  cronEnabled?: boolean;

  @Column({
    length: 40,
    nullable: true,
  })
  timezone?: string;

  @Column({
    enum: SchedulerType,
    nullable: true,
  })
  schedulerType?: SchedulerType;

  /**
   * daily
   */
  @IsBoolean({ each: true })
  @Column('boolean', { array: true, nullable: true })
  dailyWeekdays?: Weekdays;

  @Column('time', { nullable: true })
  dailyTime?: Date;

  /**
   * interval
   */
  @Column({
    length: 4,
    nullable: true,
  })
  interval?: string;

  @Column({
    enum: IntervalType,
    nullable: true,
  })
  intervalType?: IntervalType;

  /**
   * custom
   */
  minute?: string;
  hour?: string;
  dayOfMonth?: string;
  month?: string;
  dayOfWeek?: string;

  @ManyToOne(() => Query, (q) => q.schedules)
  query: Query;

  @ManyToOne(() => Customer, (customer) => customer.schedules)
  customer: Customer;

  @ManyToOne(() => User, (user) => user.schedules)
  user: User;
}
