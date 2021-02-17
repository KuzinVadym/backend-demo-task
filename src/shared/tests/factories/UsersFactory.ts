import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../../../infrastructure/repositories/UsersRepository';
import { IUser } from '../../../domains/users/types/IUser';
import { UserEntity } from '../../../infrastructure/entities/UserEntity';

export class UsersFactory {
  static async create(attr?: Partial<IUser>): Promise<UserEntity> {
    const repository = getCustomRepository(UsersRepository);
    const newUser: Partial<IUser> = {
      id: attr ? attr.id : undefined,
      login: attr ? attr.login || 'login' : 'login',
      email: attr ? attr.email || 'email' : 'email'
    };
    // @ts-ignore
    return repository.create(newUser);
  }

  static async createList(
    quantity: number,
    attr?: Partial<IUser>
  ): Promise<UserEntity[]> {
    const repository = getCustomRepository(UsersRepository);

    const populatedUsersEntities = this.populateUsersEntities(quantity, attr);

    return (await Promise.all(
      populatedUsersEntities.map(
        (entity) =>
          new Promise((resolve, reject) => {
            repository.create(entity).then((result) => {
              resolve(result);
            });
          })
      )
    )) as UserEntity[];
  }

  private static populateUsersEntities(
    quantity: number,
    attr?: Partial<IUser>
  ): IUser[] {
    const entities = new Array(quantity);
    const userDefaultAttr = {
      login: 'login',
      email: 'email'
    };
    entities.fill(attr || userDefaultAttr, 0, quantity);
    return entities;
  }
}
