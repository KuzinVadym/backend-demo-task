import { CommitsHttpResolver } from '../CommitsHttpResolver';
import { ICommitsRepository } from '../../../interfaces/ICommitsRepository';
import { setupDatabase } from '../../../../../shared/tests/setupDB';

setupDatabase();

const mockFindOneOrFailCommit = jest.fn();
const mockFindOneOrFailCommits = jest.fn();

const mockCommitsRepo: ICommitsRepository = {
  find: mockFindOneOrFailCommits,
  findOneOrFail: mockFindOneOrFailCommit,
  findLastCommitForTask: jest.fn(),
  create: jest.fn()
};

describe('CommitsHttpResolver', () => {
  let resolver: CommitsHttpResolver;

  beforeEach(async () => {
    resolver = new CommitsHttpResolver(mockCommitsRepo);
  });

  it('calls Task Repository find method with right params', async () => {
    await resolver.getCommits({ taskId: 1 });

    expect(mockCommitsRepo.find).toBeCalledWith({ taskId: 1 });
  });

  it('calls Task Repository find method with undefined', async () => {
    await resolver.getCommits();

    expect(mockCommitsRepo.find).toBeCalledWith(undefined);
  });

  it('calls Task Repository findOneOrFail method with right params', async () => {
    await resolver.getCommit(1);

    expect(mockCommitsRepo.findOneOrFail).toBeCalledWith(1);
  });
});
