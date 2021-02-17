import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { withHttpService } from '../../../shared/utils/withHttpService';
import { UserType } from './UserType';
import { CreateUserInput } from './CreateUserInput';

@Resolver(UserType)
export class CreateUserMutation {
  @Mutation(() => UserType)
  public createUser(@Arg('input') input: CreateUserInput, @Ctx() ctx) {
    const usersHttpService = withHttpService('users', ctx.getState);
    return usersHttpService.createUser(input);
  }
}
