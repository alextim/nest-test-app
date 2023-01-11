import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Parser } from './parser.entity';
import { Query } from './query.entity';

export enum SelectorType {
  Text = 'text',
  Link = 'link',
  PopupLink = 'popupLink',
  Image = 'image',
  Table = 'table',
  ElementAttribute = 'attribute',
  HTML = 'html',
  ElementScroll = 'scrollDown',
  ElementClick = 'click',
  Group = 'grouped',
  SitemapXmlLink = 'sitemap',
  Pagination = 'pagination',
}

@Unique('UQ_selector_name', ['name'])
@Entity()
export class Selector extends BaseEntity {
  @Column({
    length: 20,
  })
  name: string;

  @Column({
    length: 64,
  })
  selector: string;

  @Column({
    type: 'enum',
    enum: SelectorType,
    default: SelectorType.Text,
  })
  type: string;

  @Column({
    nullable: true,
    default: false,
  })
  multiply?: boolean;

  @Column({
    length: 64,
    nullable: true,
  })
  regex?: string;

  @OneToMany(() => Parser, (p) => p.selector)
  parsers?: Parser[];

  @ManyToOne(() => Query, (q) => q.selectors)
  query: Query;
}
