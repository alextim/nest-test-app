import { Column, Entity, ManyToOne } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { User } from '../../users/entities/user.entity';
import { Customer } from '../../customers/entities/customer.entity';
import { PostType } from './post-type.enum';

@Entity()
export class Post extends BaseEntity {
  @Column({ type: 'timestamp' })
  postDate: Date;

  @Column({ length: 128 })
  postId: string;

  @Column({ length: 256 })
  postUrl: string;

  @Column({ length: 256, nullable: true })
  articleUrl?: string;

  @Column({ length: 256, nullable: true })
  targetUrl?: string;

  @Column({ length: 256, nullable: true })
  contentUrl?: string;

  @Column({ length: 256, nullable: true })
  contentImage?: string;

  @Column({ length: 256, nullable: true })
  contentVideo?: string;

  @Column({ length: 256, nullable: true })
  contentShare?: string;

  @Column({ length: 256, nullable: true })
  contentDocument?: string;

  @Column({ length: 256 })
  profileUrl: string;

  @Column({ length: 64 })
  profileName: string;

  @Column({ length: 64, nullable: true })
  authorName?: string;

  @Column({
    type: 'enum',
    enum: PostType,
  })
  type: PostType;

  @Column({ nullable: true })
  likes?: number;

  @Column({ nullable: true })
  comments?: number;

  @Column({ nullable: true })
  views?: number;

  @Column({ nullable: true })
  reposts?: number;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ nullable: true })
  tags?: string;

  @Column({ nullable: true })
  tagsCount?: number;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @Column()
  customerId: number;
  @ManyToOne(() => Customer, (customer) => customer.posts)
  customer: Customer;
}
