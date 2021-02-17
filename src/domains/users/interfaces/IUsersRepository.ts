import { ICreateUserPayload, IUser } from '../types';

export interface IUsersRepository {
  find(filters?: Partial<IUser>): Promise<IUser[] | []>;
  findOneOrFail(userId: number): Promise<IUser>;
  create(user: ICreateUserPayload): Promise<IUser>;
}
