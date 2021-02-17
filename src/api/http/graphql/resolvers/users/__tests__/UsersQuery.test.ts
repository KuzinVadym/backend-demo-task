import 'reflect-metadata';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { UsersQuery } from '../UsersQuery';

const contextMock = {
  getState: jest.fn()
};

const usersServiceMock = {
  getUsers: jest.fn(),
  getUser: jest.fn()
};

const tasksServiceMock = {
  getTasks: jest.fn()
};

describe('UsersQuery', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    const schema = await buildSchema({ resolvers: [UsersQuery] });
    server = new ApolloServer({
      schema,
      context: contextMock
    });
  });

  beforeEach(async () => {
    usersServiceMock.getUsers.mockResolvedValue([
      { login: 'login', email: 'email' }
    ]);
    usersServiceMock.getUser.mockResolvedValue({
      id: 1,
      login: 'login',
      email: 'email'
    });
    tasksServiceMock.getTasks.mockResolvedValue([{ id: 1 }]);

    contextMock.getState.mockReturnValue({
      httpServices: {
        users: usersServiceMock,
        tasks: tasksServiceMock
      }
    });
  });

  it('returns users data', async () => {
    const testQuery = `{
      users {
        login
        email
      }
    }
  `;

    const { query }: ApolloServerTestClient = createTestClient(server);

    const res = await query({ query: testQuery, variables: {} });
    expect(res).toMatchSnapshot();
  });

  it('returns user data', async () => {
    const testQuery = `
    query UserQuery($id: Int!){
      user(id: $id) {
        login
        email
      }
    }
  `;
    const { query }: ApolloServerTestClient = createTestClient(server);

    const res = await query({ query: testQuery, variables: { id: 1 } });
    expect(res).toMatchSnapshot();
  });

  it('cals service with right params', async () => {
    const testQuery = `
    query UserQuery($id: Int!){
      user(id: $id) {
        id
        login
        email
        createdTasks{
          id
        }
        updatedTasks{
          id
        }
        assignedTasks{
          id
        }
      }
    }
  `;
    const { query }: ApolloServerTestClient = createTestClient(server);

    await query({ query: testQuery, variables: { id: 1 } });

    expect(usersServiceMock.getUser).toBeCalledWith(1);
    expect(tasksServiceMock.getTasks).toBeCalledWith({ createdByUserId: 1 });
    expect(tasksServiceMock.getTasks).toBeCalledWith({ updatedByUserId: 1 });
    expect(tasksServiceMock.getTasks).toBeCalledWith({ assignedUserId: 1 });
  });
});
