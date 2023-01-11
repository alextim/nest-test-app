import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

import type { PuppeteerLifeCycleEvent } from 'puppeteer';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Schedule } from '../../schedules/entities/schedule.entity';
import { Proxy } from '../../proxies/entities/proxy.entity';
import { Job } from '../../jobs/entities/job.entity';

import { Selector } from './selector.entity';

@Unique('UQ_query_name', ['name'])
@Entity()
export class Query extends BaseEntity {
  @Column()
  name: string;

  @Column()
  startUrl: string;

  @Column()
  requestInterval: number;

  @Column()
  pageLoadDelay: number;

  @Column()
  timeout: number;

  @Column({ default: 'load' })
  waitUntil: PuppeteerLifeCycleEvent;

  @ManyToOne(() => Proxy, (proxy) => proxy.queries)
  proxy: Proxy;

  @OneToMany(() => Selector, (sel) => sel.query)
  selectors: Selector[];

  @OneToMany(() => Schedule, (schedule) => schedule.query)
  schedules: Schedule[];

  @OneToMany(() => Job, (job) => job.query)
  jobs: Job[];
}
