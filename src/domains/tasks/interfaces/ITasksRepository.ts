import { ITask } from '../types';
import { TaskEntity } from '../../../infrastructure/entities/TaskEntity';

export interface ITasksRepository {
  find(filters?: Partial<ITask>): Promise<ITask[] | []>;
  findOneOrFail(taskId: number): Promise<ITask>;
  create(user: Omit<ITask, 'id'>): Promise<ITask>;
  update(task: Partial<ITask>): Promise<TaskEntity>;
}
