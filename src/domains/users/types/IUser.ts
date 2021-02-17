import { ITask } from '../../tasks/types';

export type IUser = {
  id: number;
  login: string;
  email: string;
  createdTasks?: ITask[];
  updatedTasks?: ITask[];
  assignedTasks?: ITask[];
};
