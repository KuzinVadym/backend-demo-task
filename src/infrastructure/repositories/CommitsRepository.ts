import { EntityManager, EntityRepository } from 'typeorm';
import { CommitEntity } from '../entities/CommitEntity';
import { ICommitsRepository } from '../../domains/commits/interfaces/ICommitsRepository';
import { ICommit } from '../../domains/commits/types';

@EntityRepository(CommitEntity)
export class CommitsRepository implements ICommitsRepository {
  constructor(private readonly manager: EntityManager) {}

  create(commit: Omit<ICommit, 'id'>): Promise<ICommit> {
    const entity = this.manager.create(CommitEntity, commit);
    return this.manager.save(entity);
  }

  find(filters?: Partial<ICommit>): Promise<ICommit[] | []> {
    return this.manager.find(CommitEntity, { where: filters || {} });
  }

  async findOneOrFail(id: number): Promise<ICommit> {
    return this.manager.findOneOrFail(CommitEntity, id);
  }

  async findLastCommitForTask(taskId: number): Promise<ICommit> {
    return this.manager.findOne(CommitEntity, {
      where: {
        taskId
      },
      order: { createdAt: 'DESC' }
    });
  }
}
