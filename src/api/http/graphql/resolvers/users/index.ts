import { NonEmptyArray } from 'type-graphql/dist/interfaces/NonEmptyArray';
import { UsersQuery } from './UsersQuery';
import { CreateUserMutation } from './CreateUserMutation';

export const combineUsersResolvers = (): NonEmptyArray<Function> => {
  return [UsersQuery, CreateUserMutation];
};
