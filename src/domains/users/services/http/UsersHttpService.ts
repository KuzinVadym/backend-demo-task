import pino, { Logger } from 'pino';
import { IGetUsersPayload } from '../../types';
import { IGetUsersResponse } from '../../types';
import { IService } from '../../../shared/interfaces/IService';
import {
  IUsersHttpResolver,
  UsersHttpResolver
} from '../../resolvers/http/UsersHttpResolver';
import { ICreateUsersResponse } from '../../types';
import { ICreateUserPayload } from '../../types';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../../../../infrastructure/repositories/UsersRepository';

export interface IUsersHttpService extends IService {
  getUsers(payload?: IGetUsersPayload): Promise<IGetUsersResponse>;
  getUser(id?: number): Promise<IGetUsersResponse>;
  createUser(payload?: ICreateUserPayload): Promise<ICreateUsersResponse>;
}

export class UsersHttpService implements IUsersHttpService {
  logger: Logger;
  constructor(
    readonly name: string,
    readonly usersHttpResolver: IUsersHttpResolver
  ) {
    this.logger = pino();
  }

  public async getUsers(
    payload?: IGetUsersPayload
  ): Promise<IGetUsersResponse> {
    return this.usersHttpResolver.getUsers(payload);
  }

  getUser(id?: number): Promise<IGetUsersResponse> {
    return this.usersHttpResolver.getUser(id);
  }

  createUser(payload?: ICreateUserPayload): Promise<ICreateUsersResponse> {
    return this.usersHttpResolver.createUser(payload);
  }
}

export function createUsersHttpService(): IUsersHttpService {
  const userRepo = getCustomRepository(UsersRepository);
  return new UsersHttpService('users', new UsersHttpResolver(userRepo));
}
