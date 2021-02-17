import { Field, Int, ObjectType } from 'type-graphql';
import { TaskType } from '../tasks/TaskType';

@ObjectType()
export class UserType {
  @Field((type) => Int)
  public id: number;

  @Field()
  public login: string;

  @Field()
  public email: string;

  @Field((type) => [TaskType], { nullable: true })
  public createdTasks: TaskType;

  @Field((type) => [TaskType], { nullable: true })
  public updatedTasks: TaskType;

  @Field((type) => [TaskType], { nullable: true })
  public assignedTasks: TaskType;
}
