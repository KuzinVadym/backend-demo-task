import {
  ICreateTaskPayload,
  IGetTasksPayload,
  ITask,
  IUpdateTaskPayload
} from '../../types';
import { ITasksRepository } from '../../interfaces/ITasksRepository';
import { TaskStatus } from '../../../../infrastructure/types';
import { ICommitsRepository } from '../../../commits/interfaces/ICommitsRepository';
import { getConnection } from 'typeorm';
import { validateStatusTransition } from '../../utils/validateStatusTransition';

export interface ITasksHttpResolver {
  getTasks(payload?: IGetTasksPayload): Promise<ITask[]>;
  getTask(id: number): Promise<ITask>;
  createTask(payload: ICreateTaskPayload): Promise<ITask>;
  updateTask(payload: IUpdateTaskPayload): Promise<ITask>;
}

export class TasksHttpResolver implements ITasksHttpResolver {
  constructor(
    private readonly taskRepo: ITasksRepository,
    private readonly commitsRepo: ICommitsRepository
  ) {}

  async getTasks(payload?: IGetTasksPayload): Promise<ITask[]> {
    return this.taskRepo.find(payload);
  }

  async getTask(id: number): Promise<ITask> {
    return this.taskRepo.findOneOrFail(id);
  }

  async createTask(payload: ICreateTaskPayload): Promise<ITask> {
    return await getConnection().transaction(async (manager) => {
      const createTask = this.taskRepo.create.bind({ manager });
      const createCommit = this.commitsRepo.create.bind({ manager });

      const newTask = await createTask({ ...payload, status: TaskStatus.ToDo });

      await createCommit({
        userId: payload.createdByUserId,
        taskId: newTask.id,
        status: TaskStatus.ToDo
      });

      return newTask;
    });
  }

  async updateTask(payload: IUpdateTaskPayload): Promise<ITask> {
    await this.validateStatus(payload.id, payload.status);

    return await getConnection().transaction(async (manager) => {
      const updateTask = this.taskRepo.update.bind({ manager });
      const createCommit = this.commitsRepo.create.bind({ manager });

      const updatedTask = await updateTask(payload);

      await createCommit({
        userId: payload.updatedByUserId,
        taskId: payload.id,
        status: updatedTask.status,
        assignedUserId: payload.assignedUserId || updatedTask.assignedUserId
      });

      return updatedTask;
    });
  }

  private async validateStatus(id: number, status: TaskStatus): Promise<void> {
    const currentTaskData = await this.taskRepo.findOneOrFail(id);

    if (status) {
      if (!validateStatusTransition(currentTaskData.status, status)) {
        throw new Error(
          `Unallowed Transition ${currentTaskData.status} -> ${status}`
        );
      }
    }
  }
}
