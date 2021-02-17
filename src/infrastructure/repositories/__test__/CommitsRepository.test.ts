import { getCustomRepository } from 'typeorm';
import { setupDatabase } from '../../../shared/tests/setupDB';
import { UsersFactory } from '../../../shared/tests/factories/UsersFactory';
import { TaskStatus } from '../../types';
import { TasksFactory } from '../../../shared/tests/factories/TasksFactory';
import { CommitsRepository } from '../CommitsRepository';
import { CommitsFactory } from '../../../shared/tests/factories/CommitsFactory';

setupDatabase();

describe('CommitsRepository', () => {
  let repository: CommitsRepository;

  beforeEach(() => {
    repository = getCustomRepository(CommitsRepository);
  });

  it('creates commit', async () => {
    const user = await UsersFactory.create();
    const task = await TasksFactory.create({
      createdByUserId: user.id,
      assignedUserId: user.id
    });
    const attr = {
      userId: user.id,
      assignedUserId: user.id,
      taskId: task.id,
      status: TaskStatus.ToDo
    };

    const result = await repository.create(attr);

    expect(result).toMatchObject({
      userId: user.id,
      assignedUserId: user.id,
      taskId: task.id,
      status: 'ToDo'
    });
  });

  it('finds commit by Id', async () => {
    const commit = await CommitsFactory.create();

    const result = await repository.findOneOrFail(commit.id);

    expect(result).toMatchObject(commit);
  });

  it('finds last Commit for Task by given taskId', async () => {
    const task = await TasksFactory.create();
    await CommitsFactory.create({ taskId: task.id, status: TaskStatus.ToDo });
    await CommitsFactory.create({
      taskId: task.id,
      status: TaskStatus.InProgress
    });
    await CommitsFactory.create({ taskId: task.id, status: TaskStatus.InQA });

    const result = await repository.findLastCommitForTask(task.id);

    expect(result.status).toEqual(TaskStatus.InQA);
  });

  it('finds commits', async () => {
    await CommitsFactory.createList(3);

    const result = await repository.find();

    expect(result.length).toEqual(3);
  });

  it('filters commits by taskId', async () => {
    const task1 = await TasksFactory.create();
    const task2 = await TasksFactory.create();
    await CommitsFactory.create({
      taskId: task1.id,
      status: TaskStatus.InProgress
    });
    await CommitsFactory.create({
      taskId: task1.id,
      status: TaskStatus.InProgress
    });
    await CommitsFactory.create({
      taskId: task2.id,
      status: TaskStatus.InProgress
    });

    const result = await repository.find({ taskId: task1.id });

    expect(result.length).toEqual(2);
  });
});
