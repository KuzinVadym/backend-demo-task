import { TaskStatus } from '../../../infrastructure/types';
import { IUser } from '../../users/types';
import { ICommit } from '../../commits/types';

export type ITask = {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdByUserId: number;
  createdByUser?: IUser;
  updatedByUserId?: number;
  updatedByUser?: IUser;
  assignedUserId?: number;
  assignedToUser?: IUser;
  commits?: ICommit[];
  createdAt?: Date;
  updatedAt?: Date;
};
