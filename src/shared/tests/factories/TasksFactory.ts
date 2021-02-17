import { ITask } from '../../../domains/tasks/types';
import { TaskEntity } from '../../../infrastructure/entities/TaskEntity';
import { getCustomRepository } from 'typeorm';
import { TasksRepository } from '../../../infrastructure/repositories/TasksRepository';
import { UsersFactory } from './UsersFactory';
import { TaskStatus } from '../../../infrastructure/types';

export class TasksFactory {
  static async create(attr?: Partial<ITask>): Promise<TaskEntity> {
    const repository = getCustomRepository(TasksRepository);

    const user = await UsersFactory.create();

    const newTask: Partial<ITask> = {
      id: attr ? attr.id : undefined,
      title: attr ? attr.title || 'title' : 'title',
      description: attr ? attr.description || 'description' : 'description',
      status: attr ? attr.status || TaskStatus.ToDo : TaskStatus.ToDo,
      createdByUserId: attr ? attr.createdByUserId || user.id : user.id,
      assignedUserId: attr ? attr.assignedUserId || user.id : user.id
    };

    // @ts-ignore
    return repository.create(newTask);
  }

  static async createList(
    quantity: number,
    attr?: Partial<ITask>
  ): Promise<TaskEntity[]> {
    let taskAttr = attr || {};
    const repository = getCustomRepository(TasksRepository);
    const user = await UsersFactory.create();
    taskAttr = {
      ...taskAttr,
      createdByUserId: attr ? attr.createdByUserId || user.id : user.id,
      assignedUserId: attr ? attr.assignedUserId || user.id : user.id
    };
    const populatedTasksEntities = this.populateTasksEntities(
      quantity,
      taskAttr
    );

    return (await Promise.all(
      populatedTasksEntities.map(
        (entity) =>
          new Promise((resolve, reject) => {
            repository.create(entity).then((result) => {
              resolve(result);
            });
          })
      )
    )) as TaskEntity[];
  }

  private static populateTasksEntities(
    quantity: number,
    attr: Partial<ITask>
  ): ITask[] {
    const entities = new Array(quantity);
    const taskDefaultAttr = {
      title: attr.title || 'title',
      description: attr.description || 'description',
      status: attr.status || TaskStatus.ToDo,
      createdByUserId: attr.createdByUserId,
      assignedUserId: attr.assignedUserId
    };
    entities.fill(taskDefaultAttr, 0, quantity);
    return entities;
  }
}
