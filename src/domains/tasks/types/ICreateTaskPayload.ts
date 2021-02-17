import { ITask } from './ITask';

export type ICreateTaskPayload = Omit<
  ITask,
  'id' | 'status' | 'createdByUser' | 'updatedByUser' | 'assignedToUser'
>;
