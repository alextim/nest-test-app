import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Schedule } from '../../schedules/entities/schedule.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';
import { Job } from '../../jobs/entities/job.entity';

import { Selector } from '../../selectors/entities/selector.entity';
import { WaitUntil } from './wait-until.enum';

@Unique('UQ_query_name', ['name'])
@Entity()
export class Query extends BaseEntity {
  @Column()
  name: string;

  @Column()
  startUrl: string;

  @Column({ default: false })
  isList?: boolean;

  @Column({ nullable: true })
  itemCount?: number;

  @Column()
  requestInterval: number;

  @Column()
  pageLoadDelay: number;

  @Column()
  timeout: number;

  @Column({ enum: WaitUntil, default: WaitUntil.load })
  waitUntil: WaitUntil;

  @Column({ nullable: true })
  proxyId?: number;

  @ManyToOne(() => Proxy, (proxy) => proxy.queries, {
    eager: true,
    nullable: true,
  })
  proxy: Proxy;

  @OneToMany(() => Selector, (sel) => sel.query, { cascade: true })
  selectors: Selector[];

  @OneToMany(() => Schedule, (schedule) => schedule.query, { cascade: true })
  schedules: Schedule[];

  @OneToMany(() => Job, (job) => job.query, { cascade: true })
  jobs: Job[];
}
