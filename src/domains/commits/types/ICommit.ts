import { TaskStatus } from '../../../infrastructure/types';
import { ITask } from '../../tasks/types';
import { IUser } from '../../users/types';

export type ICommit = {
  id: number;
  taskId: number;
  task?: ITask;
  userId: number;
  status: TaskStatus;
  assignedUserId?: number;
  assignedUser?: IUser;
};
