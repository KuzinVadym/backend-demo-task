import pino, { Logger } from 'pino';
import { getCustomRepository } from 'typeorm';
import { IService } from '../../../shared/interfaces/IService';
import { CommitsRepository } from '../../../../infrastructure/repositories/CommitsRepository';
import {
  CommitsHttpResolver,
  ICommitsHttpResolver
} from '../../resolvers/http/CommitsHttpResolver';
import { IGetCommitsPayload, IGetCommitsResponse } from '../../types';

export interface ICommitsHttpService extends IService {
  getCommits(payload?: IGetCommitsPayload): Promise<IGetCommitsResponse>;
  getCommit(id: number): Promise<IGetCommitsResponse>;
}

export class CommitsHttpService implements ICommitsHttpService {
  logger: Logger;
  constructor(
    readonly name: string,
    readonly commitsHttpResolver: ICommitsHttpResolver
  ) {
    this.logger = pino();
  }

  public async getCommits(
    payload?: IGetCommitsPayload
  ): Promise<IGetCommitsResponse> {
    return this.commitsHttpResolver.getCommits(payload);
  }

  public async getCommit(id: number): Promise<IGetCommitsResponse> {
    return this.commitsHttpResolver.getCommit(id);
  }
}

export function createCommitsHttpService(): ICommitsHttpService {
  const commitsRepo = getCustomRepository(CommitsRepository);
  return new CommitsHttpService('tasks', new CommitsHttpResolver(commitsRepo));
}
