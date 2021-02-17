import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateTaskInput {
  @Field({ nullable: false })
  public title: string;

  @Field({ nullable: false })
  public description: string;

  @Field((type) => Int, { nullable: false })
  public createdByUserId: number;
}
