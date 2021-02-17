import 'reflect-metadata';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { TasksQuery } from '../TasksQuery';

const contextMock = {
  getState: jest.fn()
};

const tasksServiceMock = {
  getTasks: jest.fn(),
  getTask: jest.fn()
};

const usersServiceMock = {
  getUser: jest.fn()
};

describe('TaskQuery', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    const schema = await buildSchema({ resolvers: [TasksQuery] });
    server = new ApolloServer({
      schema,
      context: contextMock
    });
  });

  beforeEach(async () => {
    tasksServiceMock.getTasks.mockResolvedValue([
      {
        id: 1,
        title: 'title',
        description: 'description',
        status: 'ToDo',
        currentUserId: 1,
        updatedUserId: 1,
        createdAt: new Date()
      }
    ]);
    tasksServiceMock.getTask.mockResolvedValue({
      id: 1,
      title: 'title',
      description: 'description',
      status: 'ToDo',
      currentUserId: 1,
      updatedUserId: 1,
      assignedUserId: 1,
      createdAt: new Date()
    });
    usersServiceMock.getUser.mockResolvedValue({
      id: 1
    });

    contextMock.getState.mockReturnValue({
      httpServices: {
        tasks: tasksServiceMock,
        users: usersServiceMock
      }
    });
  });

  it('returns tasks data', async () => {
    const testQuery = `{
      tasks {
        title
        description
        status
      }
    }
  `;

    const { query }: ApolloServerTestClient = createTestClient(server);

    const res = await query({ query: testQuery, variables: {} });
    expect(res).toMatchSnapshot();
  });

  it('returns task data', async () => {
    const testQuery = `
    query TaskQuery($id: Int!){
      task(id: $id) {
        title
        description
        status
      }
    }
  `;
    const { query }: ApolloServerTestClient = createTestClient(server);

    const res = await query({ query: testQuery, variables: { id: 1 } });
    expect(res).toMatchSnapshot();
  });

  it('cals service with right params', async () => {
    const testQuery = `
    query TaskQuery($id: Int!){
      task(id: $id) {
        title
        description
        status
        createdByUser{
          id
        }
        updatedByUser{
          id
        }
        assignedUser{
          id
        }
      }
    }
  `;
    const { query }: ApolloServerTestClient = createTestClient(server);

    await query({ query: testQuery, variables: { id: 1 } });

    expect(tasksServiceMock.getTask).toBeCalledWith(1);
    expect(usersServiceMock.getUser).toBeCalledWith(1);
    expect(usersServiceMock.getUser).toBeCalledWith(1);
    expect(usersServiceMock.getUser).toBeCalledWith(1);
  });
});
