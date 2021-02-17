import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { TaskStatus } from '../types';
import { ICommit } from '../../domains/commits/types';
import { TaskEntity } from './TaskEntity';

@Entity({ name: 'commits' })
export class CommitEntity implements ICommit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  taskId: number;

  @ManyToOne(() => TaskEntity, (task) => task.commits)
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;

  @Column()
  userId: number;

  @Column()
  status: TaskStatus;

  @Column({ default: null })
  assignedUserId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
