import { IUser } from './IUser';

export type ICreateUserPayload = Omit<
  IUser,
  'id' | 'createdTasks' | 'updatedTasks' | 'assignedTasks'
>;
