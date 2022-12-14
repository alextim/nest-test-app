import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Customer } from './customer.entity';

export const AUTH_COOKIE_LENGTH = 152;

@Entity()
export class LinkedInProfile extends BaseEntity {
  @Column({ length: AUTH_COOKIE_LENGTH })
  public authCookie?: string;

  @Column()
  customerId: number;

  @OneToOne(() => Customer, { onDelete: 'CASCADE' })
  @JoinColumn()
  customer: Customer;
}
