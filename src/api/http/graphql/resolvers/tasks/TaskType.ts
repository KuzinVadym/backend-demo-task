import { Field, Int, ObjectType } from 'type-graphql';
import { TaskStatus } from './TaskStatus';
import { UserType } from '../users/UserType';
import { CommitType } from '../commits/CommitType';

@ObjectType()
export class TaskType {
  @Field((type) => Int)
  public id: number;

  @Field()
  public title: string;

  @Field()
  public description: string;

  @Field((type) => TaskStatus)
  public status: TaskStatus;

  @Field((type) => Int)
  createdByUserId: number;

  @Field(() => UserType, { nullable: true })
  public createdByUser: UserType;

  @Field((type) => Int)
  updatedByUserId?: number;

  @Field(() => UserType, { nullable: true })
  public updatedByUser: UserType;

  @Field((type) => Int)
  assignedUserId?: number;

  @Field(() => UserType, { nullable: true })
  public assignedUser: UserType;

  @Field(() => [CommitType], { nullable: true })
  public commits: CommitType[];

  @Field()
  public createdAt: Date;

  @Field()
  public updateAt: Date;
}
