import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Selector } from './selector.entity';

export enum ParserType {
  RegexMatch = 'match',
  Replace = 'replace',
  Addition = 'addition',
  StripHTML = 'html',
  RemoveWhitespaces = 'spaces',
}

@Entity()
export class Parser extends BaseEntity {
  @Column({ enum: ParserType, default: ParserType.Replace })
  parserType: ParserType;

  /**
   * RegexMatch
   */
  @Column({ nullable: true })
  regex?: string;

  @Column({ nullable: true })
  matchGroup?: string;

  @Column({ default: false, nullable: true })
  multiply?: boolean;

  @Column({ default: false, nullable: true })
  separator?: boolean;

  /**
   * replace
   */
  @Column({ default: false, nullable: true })
  isRegex?: boolean;

  @Column({
    length: 64,
    nullable: true,
  })
  pattern?: string;

  @Column({
    length: 64,
    nullable: true,
  })
  replacement?: string;

  /**
   * Addition
   */

  @Column({ length: 64, nullable: true })
  append?: string;

  @Column({ length: 64, nullable: true })
  prepend?: string;

  /**
   * Strip HTML
   */
  @Column({ default: true, nullable: true })
  stripHtmlTags?: boolean;

  @Column({ default: false, nullable: true })
  decodeHtmlEntities?: boolean;

  /**
   * RemoveWhitespaces
   */
  @Column({ default: true, nullable: true })
  removeWhitespaces?: boolean;

  @Column({ default: false, nullable: true })
  removeNewlines?: boolean;

  @ManyToOne(() => Selector, (sel) => sel.parsers)
  selector: Selector;
}
