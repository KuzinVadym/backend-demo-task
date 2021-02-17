import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { CreateTaskMutation } from '../CreateTaskMutation';
import { TasksQuery } from '../TasksQuery';

const contextMock = {
  getState: jest.fn()
};

const tasksServiceMock = {
  createTask: jest.fn()
};

describe('CreateTaskMutation', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    const schema = await buildSchema({
      resolvers: [TasksQuery, CreateTaskMutation],
      dateScalarMode: 'timestamp'
    });
    server = new ApolloServer({
      schema,
      context: contextMock
    });
  });

  beforeEach(async () => {
    contextMock.getState.mockReturnValue({
      httpServices: {
        tasks: tasksServiceMock
      }
    });
  });

  it('cals service with right params', async () => {
    const testMutation = `
    mutation CreateTaskMutation($input: CreateTaskInput!){
      createTask(input: $input) {
        title
        description
        status
      }
    }
  `;
    const { mutate }: ApolloServerTestClient = createTestClient(server);

    await mutate({
      mutation: testMutation,
      variables: {
        input: {
          title: 'title',
          description: 'description',
          createdByUserId: 1
        }
      }
    });

    expect(tasksServiceMock.createTask).toBeCalledWith({
      title: 'title',
      description: 'description',
      createdByUserId: 1
    });
  });

  it('returns error if mutation calls without needed params', async () => {
    const testMutation = `
    mutation CreateTaskMutation($input: CreateTaskInput!){
      createTask(input: $input) {
        title
        description
        status
      }
    }
  `;
    const { mutate }: ApolloServerTestClient = createTestClient(server);

    const result = await mutate({
      mutation: testMutation,
      variables: {}
    });

    expect(result.errors.length > 0).toBeTruthy();
  });
});
