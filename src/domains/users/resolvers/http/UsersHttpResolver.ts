import { IUser, IGetUsersPayload, ICreateUserPayload } from '../../types';
import { IUsersRepository } from '../../interfaces/IUsersRepository';

export interface IUsersHttpResolver {
  getUsers(payload?: IGetUsersPayload): Promise<IUser[]>;
  getUser(id: number): Promise<IUser>;
  createUser(payload: ICreateUserPayload): Promise<IUser>;
}

export class UsersHttpResolver implements IUsersHttpResolver {
  constructor(private readonly userRepo: IUsersRepository) {}

  async getUsers(payload?: IGetUsersPayload): Promise<IUser[]> {
    return this.userRepo.find();
  }

  async getUser(id: number): Promise<IUser> {
    return this.userRepo.findOneOrFail(id);
  }

  async createUser(payload: ICreateUserPayload): Promise<IUser> {
    return this.userRepo.create(payload);
  }
}
