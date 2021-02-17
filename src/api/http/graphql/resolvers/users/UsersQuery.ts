import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { UserType } from './UserType';
import { withHttpService } from '../../../shared/utils/withHttpService';

@Resolver((of) => UserType)
export class UsersQuery {
  @Query(() => [UserType])
  public async users(@Ctx() ctx): Promise<UserType[]> {
    const userHttpService = withHttpService('users', ctx.getState);
    return userHttpService.getUsers();
  }

  @Query(() => UserType)
  public async user(
    @Arg('id', (type) => Int) id: number,
    @Ctx() ctx
  ): Promise<UserType> {
    const userHttpService = withHttpService('users', ctx.getState);
    return userHttpService.getUser(id);
  }

  @FieldResolver()
  async createdTasks(@Root() user: UserType, @Ctx() ctx) {
    const userHttpService = withHttpService('tasks', ctx.getState);
    return userHttpService.getTasks({ createdByUserId: user.id });
  }

  @FieldResolver()
  async updatedTasks(@Root() user: UserType, @Ctx() ctx) {
    const userHttpService = withHttpService('tasks', ctx.getState);
    return userHttpService.getTasks({ updatedByUserId: user.id });
  }

  @FieldResolver()
  async assignedTasks(@Root() user: UserType, @Ctx() ctx) {
    const userHttpService = withHttpService('tasks', ctx.getState);
    return userHttpService.getTasks({ assignedUserId: user.id });
  }
}
