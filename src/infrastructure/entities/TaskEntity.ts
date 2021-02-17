import { ITask } from '../../domains/tasks/types';
import { UserEntity } from './UserEntity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { TaskStatus } from '../types';
import { CommitEntity } from './CommitEntity';

@Entity({ name: 'tasks' })
export class TaskEntity implements ITask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @Column({ type: 'int', nullable: false })
  createdByUserId: number;

  @ManyToOne(() => UserEntity, (user) => user.createdTasks)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser?: UserEntity;

  @Column({ type: 'int', default: null })
  updatedByUserId?: number;

  @ManyToOne(() => UserEntity, (user) => user.updatedTasks)
  @JoinColumn({ name: 'updatedByUserId' })
  updatedByUser?: UserEntity;

  @Column({ type: 'int', default: null })
  assignedUserId?: number;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks)
  @JoinColumn({ name: 'assignedUserId' })
  assignedToUser?: UserEntity;

  @OneToMany(() => CommitEntity, (commit) => commit.task)
  @JoinColumn()
  commits?: CommitEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
