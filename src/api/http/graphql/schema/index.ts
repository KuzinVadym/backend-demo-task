import { buildSchema } from 'type-graphql';
import { combineUsersResolvers } from '../resolvers/users';
import { combineTasksResolvers } from '../resolvers/tasks';
import { combineCommitsResolvers } from '../resolvers/commits';

export async function getSchema() {
  const usersResolvers = combineUsersResolvers();
  const taskResolvers = combineTasksResolvers();
  const commitsResolvers = combineCommitsResolvers();
  return buildSchema({
    resolvers: [...usersResolvers, ...taskResolvers, ...commitsResolvers],
    dateScalarMode: 'timestamp'
  });
}
