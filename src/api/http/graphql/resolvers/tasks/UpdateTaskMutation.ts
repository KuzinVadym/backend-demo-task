import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { TaskType } from './TaskType';
import { UpdateTaskInput } from './UpdateTaskInput';
import { withHttpService } from '../../../shared/utils/withHttpService';

@Resolver(TaskType)
export class UpdateTaskMutation {
  @Mutation(() => TaskType)
  public updateTask(@Arg('input') input: UpdateTaskInput, @Ctx() ctx) {
    const tasksHttpService = withHttpService('tasks', ctx.getState);
    return tasksHttpService.updateTask(input);
  }
}
