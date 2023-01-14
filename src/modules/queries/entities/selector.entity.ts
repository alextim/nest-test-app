import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';

import { BaseEntity } from '../../../core/entities/BaseEntity';

import { Parser } from './parser.entity';
import { Query } from './query.entity';
import { SelectorType } from './selector-type.enum';

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
  type: SelectorType;

  @Column({
    nullable: true,
    default: false,
  })
  multiply?: boolean;

  @OneToMany(() => Parser, (parser) => parser.selector, { cascade: true })
  parsers?: Parser[];

  @Column()
  queryId: number;

  @ManyToOne(() => Query, (q) => q.selectors, { onDelete: 'CASCADE' })
  query: Query;

  /**
   * Selector's tree
   * https://www.slideshare.net/billkarwin/models-for-hierarchical-data
   * https://github.com/typeorm/typeorm/blob/master/docs/tree-entities.md
   * 
   * https://stackoverflow.com/questions/67385016/getting-data-in-self-referencing-relation-with-typeorm
   * 
   * 
   * the best
   * Adjacency Model + Nested Sets Model
   * https://stackoverflow.com/questions/4048151/what-are-the-options-for-storing-hierarchical-data-in-a-relational-database
   * https://dba.stackexchange.com/questions/89051/stored-procedure-to-update-an-adjacency-model-to-nested-sets-model
   * 
   * PG
   * https://stackoverflow.com/a/38701519
   */
  @OneToMany(() => Selector, sel => sel.parent)
  children: Selector[];

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Selector, sel => sel.children, { onDelete: 'CASCADE' })
  @JoinColumn()
  parent: Selector;  
}
