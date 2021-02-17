import { TasksHttpResolver } from '../TasksHttpResolver';
import { ITasksRepository } from '../../../interfaces/ITasksRepository';
import { ICommitsRepository } from '../../../../commits/interfaces/ICommitsRepository';
import { setupDatabase } from '../../../../../shared/tests/setupDB';
import { TaskStatus } from '../../../../../infrastructure/types';

setupDatabase();

const mockFindOneOrFailTask = jest.fn();
const mockCreateTask = jest.fn();
const mockUpdateTask = jest.fn();

const mockTasksRepo: ITasksRepository = {
  find: jest.fn(),
  findOneOrFail: mockFindOneOrFailTask,
  create: mockCreateTask,
  update: mockUpdateTask
};

const mockCommitsRepo: ICommitsRepository = {
  find: jest.fn(),
  findOneOrFail: jest.fn(),
  findLastCommitForTask: jest.fn(),
  create: jest.fn()
};

describe('TasksHttpResolver', () => {
  let resolver: TasksHttpResolver;

  beforeEach(async () => {
    resolver = new TasksHttpResolver(mockTasksRepo, mockCommitsRepo);
  });

  describe('createTask', () => {
    const createdTaskData = {
      id: 1,
      title: 'title',
      description: 'description',
      createdByUserId: 1,
      status: 'ToDo'
    };

    beforeEach(async () => {
      mockCreateTask.mockResolvedValue(createdTaskData);
    });

    afterEach(async () => {
      mockCreateTask.mockReset();
    });

    it('calls Task Repository create method with right params', async () => {
      await resolver.createTask({
        title: 'title',
        description: 'description',
        createdByUserId: 1
      });

      expect(mockTasksRepo.create).toBeCalledWith({
        title: 'title',
        description: 'description',
        createdByUserId: 1,
        status: 'ToDo'
      });
    });

    it('calls Commit Repository create method with right params', async () => {
      await resolver.createTask({
        title: 'title',
        description: 'description',
        createdByUserId: 1
      });

      expect(mockCommitsRepo.create).toBeCalledWith({
        userId: createdTaskData.createdByUserId,
        taskId: createdTaskData.id,
        status: createdTaskData.status
      });
    });
  });

  describe('updateTask', () => {
    const currentTaskData = {
      id: 1,
      title: 'title',
      description: 'description',
      createdByUserId: 1,
      status: TaskStatus.ToDo
    };
    const updatedTaskData = {
      id: 1,
      title: 'newtitle',
      description: 'newdescription',
      createdByUserId: 1,
      status: TaskStatus.InProgress,
      updatedByUserId: 11
    };

    beforeEach(async () => {
      mockFindOneOrFailTask.mockResolvedValue(currentTaskData);
      mockUpdateTask.mockResolvedValue(updatedTaskData);
    });

    afterEach(async () => {
      mockUpdateTask.mockReset();
    });

    const updateTaskPayload = {
      id: 1,
      status: TaskStatus.InProgress,
      updatedByUserId: 11
    };

    it('calls Task Repository create method with right params', async () => {
      await resolver.updateTask({
        id: 1,
        status: TaskStatus.InProgress,
        updatedByUserId: 11
      });

      expect(mockTasksRepo.update).toBeCalledWith({
        id: 1,
        status: TaskStatus.InProgress,
        updatedByUserId: 11
      });
    });

    it('calls Commit Repository create method with right params', async () => {
      await resolver.updateTask(updateTaskPayload);

      expect(mockCommitsRepo.create).toBeCalledWith({
        userId: updateTaskPayload.updatedByUserId,
        taskId: updateTaskPayload.id,
        status: updateTaskPayload.status
      });
    });

    it('does not check status transition if status not specified', async () => {
      await resolver.updateTask({ ...updateTaskPayload, status: undefined });

      expect(mockTasksRepo.update).toBeCalledWith({
        id: updateTaskPayload.id,
        updatedByUserId: updateTaskPayload.updatedByUserId,
        status: undefined
      });
    });

    it('throw Error if status transition not allowed', async () => {
      expect.assertions(1);
      resolver
        .updateTask({ ...updateTaskPayload, status: TaskStatus.InQA })
        .catch((error) => {
          expect(error.message).toEqual('Unallowed Transition ToDo -> InQA');
        });
    });
  });

  it('calls Task Repository find method with right params', async () => {
    await resolver.getTasks({ createdByUserId: 1 });

    expect(mockTasksRepo.find).toBeCalledWith({ createdByUserId: 1 });
  });

  it('calls Task Repository find method with undefined', async () => {
    await resolver.getTasks();

    expect(mockTasksRepo.find).toBeCalledWith(undefined);
  });

  it('calls Task Repository findOneOrFail method with right params', async () => {
    await resolver.getTask(1);

    expect(mockTasksRepo.findOneOrFail).toBeCalledWith(1);
  });
});
