import { setupDatabase } from '../../../shared/tests/setupDB';
import { getCustomRepository } from 'typeorm';
import { UsersFactory } from '../../../shared/tests/factories/UsersFactory';
import { TasksRepository } from '../TasksRepository';
import { TasksFactory } from '../../../shared/tests/factories/TasksFactory';
import { TaskStatus } from '../../types';

setupDatabase();

describe('TasksRepository', () => {
  let repository: TasksRepository;

  beforeEach(() => {
    repository = getCustomRepository(TasksRepository);
  });

  it('creates task', async () => {
    const user = await UsersFactory.create();
    const attr = {
      title: 'title',
      description: 'description',
      status: TaskStatus.ToDo,
      createdByUserId: user.id
    };

    const result = await repository.create(attr);

    expect(result).toMatchObject({
      title: 'title',
      description: 'description',
      status: 'ToDo',
      createdByUserId: user.id
    });
  });

  it('finds task by Id', async () => {
    const task = await TasksFactory.create();

    const result = await repository.findOneOrFail(task.id);

    expect(result).toMatchObject(task);
  });

  it('finds tasks', async () => {
    await TasksFactory.createList(3);

    const result = await repository.find();

    expect(result.length).toEqual(3);
  });

  it('updates task', async () => {
    await UsersFactory.create({ id: 11 });
    const task = await TasksFactory.create();
    const updateAttr = {
      id: task.id,
      status: TaskStatus.InProgress,
      updatedByUserId: 11
    };

    const result = await repository.update(updateAttr);

    expect(result).toMatchObject({
      status: TaskStatus.InProgress,
      updatedByUserId: 11
    });
  });
});
