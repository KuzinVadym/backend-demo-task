import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { UsersQuery } from '../UsersQuery';
import { CreateUserMutation } from '../CreateUserMutation';

const contextMock = {
  getState: jest.fn()
};

const usersServiceMock = {
  createUser: jest.fn()
};

describe('CreateUserMutation', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    const schema = await buildSchema({
      resolvers: [UsersQuery, CreateUserMutation],
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
        users: usersServiceMock
      }
    });
  });

  it('cals service with right params', async () => {
    const testMutation = `
    mutation CreateUserMutation($input: CreateUserInput!){
      createUser(input: $input) {
        login
        email
      }
    }
  `;
    const { mutate }: ApolloServerTestClient = createTestClient(server);

    await mutate({
      mutation: testMutation,
      variables: {
        input: {
          login: 'login',
          email: 'email'
        }
      }
    });

    expect(usersServiceMock.createUser).toBeCalledWith({
      login: 'login',
      email: 'email'
    });
  });
});
