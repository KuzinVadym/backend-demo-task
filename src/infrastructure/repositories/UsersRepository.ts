import { UserEntity } from '../entities/UserEntity';
import { EntityManager, EntityRepository } from 'typeorm';
import { IUsersRepository } from '../../domains/users/interfaces/IUsersRepository';
import { ICreateUserPayload, IUser } from '../../domains/users/types';

@EntityRepository(UserEntity)
export class UsersRepository implements IUsersRepository {
  constructor(private readonly manager: EntityManager) {}

  async create(user: ICreateUserPayload): Promise<UserEntity> {
    const entity = this.manager.create(UserEntity, user);
    return this.manager.save(entity);
  }

  async find(filters?: Partial<IUser>): Promise<IUser[] | []> {
    return this.manager.find(UserEntity, { where: filters || {} });
  }

  async findOneOrFail(userId: number): Promise<UserEntity> {
    return this.manager
      .createQueryBuilder(UserEntity, 'users')
      .where('users.id = :id', { id: userId })
      .leftJoinAndSelect('users.createdTasks', 'createdTasks')
      .leftJoinAndSelect('users.updatedTasks', 'updatedTasks')
      .leftJoinAndSelect('users.assignedTasks', 'assignedTasks')
      .getOne();
  }
}
