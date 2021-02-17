import { getCustomRepository } from 'typeorm';
import { UsersFactory } from './UsersFactory';
import { TaskStatus } from '../../../infrastructure/types';
import { CommitEntity } from '../../../infrastructure/entities/CommitEntity';
import { CommitsRepository } from '../../../infrastructure/repositories/CommitsRepository';
import { ICommit } from '../../../domains/commits/types';
import { TasksFactory } from './TasksFactory';

export class CommitsFactory {
  static async create(attr?: Partial<ICommit>): Promise<CommitEntity> {
    const repository = getCustomRepository(CommitsRepository);

    const user = await UsersFactory.create();
    const task =
      !attr || !attr.taskId
        ? await TasksFactory.create({ createdByUserId: user.id || undefined })
        : null;

    const newTask: Partial<ICommit> = {
      id: attr ? attr.id : undefined,
      userId: attr ? attr.userId || user.id : user.id,
      assignedUserId: attr ? attr.assignedUserId || user.id : user.id,
      taskId: attr ? attr.taskId || task.id : task.id,
      status: attr ? attr.status || TaskStatus.ToDo : TaskStatus.ToDo
    };

    // @ts-ignore
    return repository.create(newTask);
  }

  static async createList(
    quantity: number,
    attr?: Partial<ICommit>
  ): Promise<CommitEntity[]> {
    let commitAttr = attr || {};
    const repository = getCustomRepository(CommitsRepository);
    const user = await UsersFactory.create();
    commitAttr = {
      ...commitAttr,
      userId: attr ? attr.userId || user.id : user.id,
      assignedUserId: attr ? attr.assignedUserId || user.id : user.id
    };
    const populatedTasksEntities = await this.populateTasksEntities(
      quantity,
      commitAttr
    );

    return (await Promise.all(
      populatedTasksEntities.map(
        (entity) =>
          new Promise((resolve, _reject) => {
            TasksFactory.create({ createdByUserId: entity.userId }).then(
              (factoryResult) => {
                repository
                  .create({ ...entity, taskId: factoryResult.id })
                  .then((result) => {
                    resolve(result);
                  });
              }
            );
          })
      )
    )) as CommitEntity[];
  }

  private static async populateTasksEntities(
    quantity: number,
    attr: Partial<ICommit>
  ): Promise<ICommit[]> {
    const entities = new Array(quantity);

    const taskDefaultAttr = {
      userId: attr.userId,
      assignedUserId: attr.assignedUserId,
      status: attr.status || TaskStatus.ToDo
    };
    entities.fill(taskDefaultAttr, 0, quantity);
    return entities;
  }
}
