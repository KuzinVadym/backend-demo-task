import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Query,
  Resolver,
  Root
} from 'type-graphql';
import { withHttpService } from '../../../shared/utils/withHttpService';
import { TaskType } from './TaskType';

@Resolver((of) => TaskType)
export class TasksQuery {
  @Query(() => [TaskType])
  public async tasks(@Ctx() ctx): Promise<TaskType[]> {
    const userHttpService = withHttpService('tasks', ctx.getState);
    return userHttpService.getTasks();
  }

  @Query(() => TaskType)
  public async task(
    @Arg('id', (type) => Int) id: number,
    @Ctx() ctx
  ): Promise<TaskType> {
    const userHttpService = withHttpService('tasks', ctx.getState);
    return userHttpService.getTask(id);
  }

  @FieldResolver()
  async createdByUser(@Root() task: TaskType, @Ctx() ctx) {
    const userHttpService = withHttpService('users', ctx.getState);
    return userHttpService.getUser(task.createdByUserId);
  }

  @FieldResolver()
  async updatedByUser(@Root() task: TaskType, @Ctx() ctx) {
    const userHttpService = withHttpService('users', ctx.getState);
    return userHttpService.getUser(task.updatedByUserId);
  }

  @FieldResolver()
  async assignedUser(@Root() task: TaskType, @Ctx() ctx) {
    const userHttpService = withHttpService('users', ctx.getState);
    return userHttpService.getUser(task.assignedUserId);
  }

  @FieldResolver()
  async commits(@Root() task: TaskType, @Ctx() ctx) {
    const userHttpService = withHttpService('commits', ctx.getState);
    return userHttpService.getCommits({ taskId: task.id });
  }
}
