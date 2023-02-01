import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';
import { Schedule } from './schedule.entity';

@Unique('UQ_timezone_code', ['code'])
@Unique('UQ_timezone_name', ['name'])
@Entity()
export class Timezone extends BaseEntity {
  @Column({ length: 40 })
  code: string;

  @Column({ length: 40 })
  name: string;

  @OneToMany(() => Schedule, (schedule) => schedule.timezone, { cascade: true })
  schedules: Schedule[];
}
