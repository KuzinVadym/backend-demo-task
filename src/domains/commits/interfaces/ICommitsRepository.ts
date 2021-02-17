import { ICommit } from '../types';

export interface ICommitsRepository {
  find(filters?: Partial<ICommit>): Promise<ICommit[] | []>;
  findOneOrFail(id: number): Promise<ICommit>;
  findLastCommitForTask(taskId: number): Promise<ICommit>;
  create(user: Omit<ICommit, 'id'>): Promise<ICommit>;
}
