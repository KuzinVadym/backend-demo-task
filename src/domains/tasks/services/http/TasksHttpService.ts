import pino, { Logger } from 'pino';
import { getCustomRepository } from 'typeorm';
import {
  ITasksHttpResolver,
  TasksHttpResolver
} from '../../resolvers/http/TasksHttpResolver';
import { IService } from '../../../shared/interfaces/IService';
import {
  IUpdateTasksResponse,
  IGetTasksPayload,
  IGetTasksResponse,
  ICreateTaskPayload,
  ICreateTasksResponse
} from '../../types';
import { TasksRepository } from '../../../../infrastructure/repositories/TasksRepository';
import { CommitsRepository } from '../../../../infrastructure/repositories/CommitsRepository';
import { IUpdateTaskPayload } from '../../types';

export interface ITasksHttpService extends IService {
  getTasks(payload?: IGetTasksPayload): Promise<IGetTasksResponse>;
  getTask(id: number): Promise<IGetTasksResponse>;
  createTask(payload: ICreateTaskPayload): Promise<ICreateTasksResponse>;
  updateTask(payload: IUpdateTaskPayload): Promise<IUpdateTasksResponse>;
}

export class TasksHttpService implements ITasksHttpService {
  logger: Logger;
  constructor(
    readonly name: string,
    readonly tasksHttpResolver: ITasksHttpResolver
  ) {
    this.logger = pino();
  }

  public async getTasks(
    payload?: IGetTasksPayload
  ): Promise<IGetTasksResponse> {
    return this.tasksHttpResolver.getTasks(payload);
  }

  public async getTask(id: number): Promise<IGetTasksResponse> {
    return this.tasksHttpResolver.getTask(id);
  }

  createTask(payload: ICreateTaskPayload): Promise<ICreateTasksResponse> {
    return this.tasksHttpResolver.createTask(payload);
  }

  updateTask(payload: ICreateTaskPayload): Promise<ICreateTasksResponse> {
    return this.tasksHttpResolver.updateTask(payload);
  }
}

export function createTasksHttpService(): ITasksHttpService {
  const tasksRepo = getCustomRepository(TasksRepository);
  const commitsRepo = getCustomRepository(CommitsRepository);
  return new TasksHttpService(
    'tasks',
    new TasksHttpResolver(tasksRepo, commitsRepo)
  );
}
