import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class UpdateTaskInput {
  @Field((type) => Int, { nullable: false })
  public id: string;

  @Field({ nullable: true })
  public title: string;

  @Field({ nullable: true })
  public description: string;

  @Field((type) => Int, { nullable: false })
  public updatedByUserId: number;

  @Field((type) => Int, { nullable: true })
  public assignedUserId: number;

  @Field({ nullable: true })
  public status: string;
}
