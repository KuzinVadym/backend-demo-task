import { Field, Int, ObjectType } from 'type-graphql';
import { TaskStatus } from '../tasks/TaskStatus';

@ObjectType()
export class CommitType {
  @Field((type) => Int, { nullable: false })
  public id: number;

  @Field((type) => Int, { nullable: false })
  public taskId: number;

  @Field((type) => Int, { nullable: false })
  public userId: number;

  @Field((type) => TaskStatus)
  public status: TaskStatus;

  @Field((type) => Int, { nullable: true })
  public assignedUserId: number;

  @Field()
  public createdAt: Date;
}
