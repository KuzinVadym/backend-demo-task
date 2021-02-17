import { ICommit, IGetCommitsPayload } from '../../types';
import { ICommitsRepository } from '../../interfaces/ICommitsRepository';

export interface ICommitsHttpResolver {
  getCommits(payload?: IGetCommitsPayload): Promise<ICommit[]>;
  getCommit(id: number): Promise<ICommit>;
}

export class CommitsHttpResolver implements ICommitsHttpResolver {
  constructor(private readonly commitsRepo: ICommitsRepository) {}

  async getCommits(payload?: IGetCommitsPayload): Promise<ICommit[]> {
    return this.commitsRepo.find(payload);
  }

  async getCommit(id: number): Promise<ICommit> {
    return this.commitsRepo.findOneOrFail(id);
  }
}
