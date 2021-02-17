import { EntityManager, EntityRepository } from 'typeorm';
import { TaskEntity } from '../entities/TaskEntity';
import { ICreateTaskPayload, ITask } from '../../domains/tasks/types';
import { ITasksRepository } from '../../domains/tasks/interfaces/ITasksRepository';

@EntityRepository(TaskEntity)
export class TasksRepository implements ITasksRepository {
  constructor(private readonly manager: EntityManager) {}

  async find(filters?: Partial<ITask>): Promise<ITask[] | []> {
    return this.manager.find(TaskEntity, { where: filters || {} });
  }

  async findOneOrFail(taskId: number): Promise<TaskEntity> {
    return this.manager
      .createQueryBuilder(TaskEntity, 'tasks')
      .where('tasks.id = :id', { id: taskId })
      .leftJoinAndSelect('tasks.createdByUser', 'createdByUser')
      .leftJoinAndSelect('tasks.updatedByUser', 'updatedByUser')
      .leftJoinAndSelect('tasks.assignedToUser', 'assignedToUser')
      .getOneOrFail();
  }

  async create(task: ICreateTaskPayload): Promise<TaskEntity> {
    const entity = this.manager.create(TaskEntity, task);
    return this.manager.save(entity);
  }

  async update(task: Partial<ITask>): Promise<TaskEntity> {
    await this.manager.save(TaskEntity, task);
    return this.manager.findOneOrFail(TaskEntity, task.id);
  }
}
