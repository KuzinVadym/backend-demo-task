import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { CreateTaskMutation } from '../CreateTaskMutation';
import { TasksQuery } from '../TasksQuery';
import { UpdateTaskMutation } from '../UpdateTaskMutation';

const contextMock = {
  getState: jest.fn()
};

const tasksServiceMock = {
  updateTask: jest.fn()
};

describe('CreateTaskMutation', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    const schema = await buildSchema({
      resolvers: [TasksQuery, UpdateTaskMutation],
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
    mutation UpdateTaskMutation($input: UpdateTaskInput!){
      updateTask(input: $input) {
        id
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
          id: 1,
          title: 'title',
          description: 'description',
          updatedByUserId: 1,
          assignedUserId: 11
        }
      }
    });

    expect(tasksServiceMock.updateTask).toBeCalledWith({
      id: 1,
      title: 'title',
      description: 'description',
      updatedByUserId: 1,
      assignedUserId: 11
    });
  });
});
