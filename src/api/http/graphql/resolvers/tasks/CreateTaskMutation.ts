import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { withHttpService } from '../../../shared/utils/withHttpService';
import { TaskType } from './TaskType';
import { CreateTaskInput } from './CreateTaskInput';

@Resolver(TaskType)
export class CreateTaskMutation {
  @Mutation(() => TaskType)
  public createTask(@Arg('input') input: CreateTaskInput, @Ctx() ctx) {
    const tasksHttpService = withHttpService('tasks', ctx.getState);
    return tasksHttpService.createTask(input);
  }
}
