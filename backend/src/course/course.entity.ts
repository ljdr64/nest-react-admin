import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Content } from '../content/content.entity';

@Entity()
export class Course extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp' })
  dateCreated: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  dateUpdated: Date;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];
}
