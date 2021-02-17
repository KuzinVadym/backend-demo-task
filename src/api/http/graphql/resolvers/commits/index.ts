import { NonEmptyArray } from 'type-graphql/dist/interfaces/NonEmptyArray';
import { CommitQuery } from './CommitQuery';

export const combineCommitsResolvers = (): NonEmptyArray<Function> => {
  return [CommitQuery];
};
