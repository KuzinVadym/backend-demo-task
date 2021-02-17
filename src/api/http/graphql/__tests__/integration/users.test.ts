import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import pino from 'pino';
import { AppServer } from '../../../../../rootService';
import { IConnectionSettings } from '../../../../../shared/interfaces/ISettings';
import { initOrmEntities } from '../../../../../infrastructure/entities';
import { createHttpServices } from '../../../../../domains';
import { truncateTables } from '../../../../../shared/tests/truncateTables';
import { disconnectDB } from '../../../../../infrastructure/typeorm/config';
import { UsersFactory } from '../../../../../shared/tests/factories/UsersFactory';

const logger = pino();

afterAll(async () => {
  await disconnectDB();
});

describe('users integration tests', () => {
  let server: ApolloServer;

  const testDBSettings: IConnectionSettings = {
    database: 'k2',
    type: 'mysql',
    username: 'k2',
    password: 'password',
    host: 'localhost',
    synchronize: true
  };

  beforeAll(async () => {
    const testAppSrv = new AppServer(
      { port: '4000', database: testDBSettings },
      logger
    );
    await testAppSrv.withDB(initOrmEntities());
    testAppSrv.withHttpServices(createHttpServices());
    server = await testAppSrv.initTest();
  });

  beforeEach(async () => {
    await truncateTables();
  });

  afterEach(async () => {
    await truncateTables();
  });

  it('creates new user', async () => {
    const testMutation = `
    mutation CreateUserMutation($input: CreateUserInput!){
      createUser(input: $input) {
        id
        login
        email
      }
    }
  `;
    const { mutate }: ApolloServerTestClient = createTestClient(server);

    const result = await mutate({
      mutation: testMutation,
      variables: {
        input: {
          login: 'login',
          email: 'email'
        }
      }
    });

    expect(result.data.createUser).toMatchObject({
      id: expect.any(Number),
      login: 'login',
      email: 'email'
    });
  });

  it('finds user by Id', async () => {
    const attr = {
      login: 'login',
      email: 'email'
    };
    const user = await UsersFactory.create(attr);

    const testQuery = `
    query UserQuery($id: Int!){
      user(id: $id) {
        id
        login
        email
      }
    }
  `;
    const { query }: ApolloServerTestClient = createTestClient(server);

    const result = await query({
      query: testQuery,
      variables: { id: user.id }
    });

    expect(result.data.user).toMatchObject({
      id: expect.any(Number),
      login: 'login',
      email: 'email'
    });
  });

  it('returns users data', async () => {
    const attr = {
      login: 'login',
      email: 'email'
    };

    await UsersFactory.createList(3, attr);

    const testQuery = `{
      users {
        login
        email
      }
    }
  `;

    const { query }: ApolloServerTestClient = createTestClient(server);

    const res = await query({ query: testQuery, variables: {} });
    expect(res.data.users.length).toEqual(3);
  });
});
