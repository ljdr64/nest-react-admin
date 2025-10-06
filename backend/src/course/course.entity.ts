import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
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

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  votesCount: number;

  @OneToMany(() => Content, (content) => content.course)
  contents: Content[];

  @OneToMany(() => CourseVote, (vote) => vote.course)
  votes: CourseVote[];
}

@Entity()
export class CourseVote extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Course, (course) => course.votes, { onDelete: 'CASCADE' })
  course: Course;

  @Column()
  userId: string;

  @Column({ type: 'int' })
  rating: number;

  @CreateDateColumn({ type: 'timestamp' })
  dateCreated: Date;
}
