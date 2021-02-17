import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateUserInput {
  @Field({ nullable: false })
  public login: string;

  @Field({ nullable: false })
  public email: string;
}
