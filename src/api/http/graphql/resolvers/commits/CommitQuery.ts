import { Arg, Ctx, Int, Query, Resolver } from 'type-graphql';
import { withHttpService } from '../../../shared/utils/withHttpService';
import { CommitType } from './CommitType';

@Resolver((of) => CommitType)
export class CommitQuery {
  @Query(() => [CommitType])
  public async commits(@Ctx() ctx): Promise<CommitType[]> {
    const userHttpService = withHttpService('commits', ctx.getState);
    return userHttpService.getCommits();
  }

  @Query(() => CommitType)
  public async commit(
    @Arg('id', (type) => Int) id: number,
    @Ctx() ctx
  ): Promise<CommitType> {
    const userHttpService = withHttpService('commits', ctx.getState);
    return userHttpService.getCommit(id);
  }
}
