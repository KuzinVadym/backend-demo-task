import { NonEmptyArray } from 'type-graphql/dist/interfaces/NonEmptyArray';
import { TasksQuery } from './TasksQuery';
import { CreateTaskMutation } from './CreateTaskMutation';
import { UpdateTaskMutation } from './UpdateTaskMutation';

export const combineTasksResolvers = (): NonEmptyArray<Function> => {
  return [TasksQuery, CreateTaskMutation, UpdateTaskMutation];
};
