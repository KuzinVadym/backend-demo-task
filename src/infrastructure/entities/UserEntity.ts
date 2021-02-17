import { IUser } from '../../domains/users/types';
import { TaskEntity } from './TaskEntity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  login: string;

  @OneToMany(() => TaskEntity, (task) => task.createdByUser)
  @JoinColumn()
  createdTasks?: TaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.updatedByUser)
  @JoinColumn()
  updatedTasks?: TaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.assignedToUser)
  @JoinColumn()
  assignedTasks?: TaskEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
