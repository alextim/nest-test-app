import { BaseEntity } from '../../../core/entities/BaseEntity';
import { Column, Entity } from 'typeorm';

@Entity()
export class LocalFile extends BaseEntity {
  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column()
  mimetype: string;
}

export default LocalFile;
