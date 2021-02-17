import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import pino from 'pino';
import { AppServer } from '../../../../../../rootService';
import { IConnectionSettings } from '../../../../../../shared/interfaces/ISettings';
import { initOrmEntities } from '../../../../../../infrastructure/entities';
import { createHttpServices } from '../../../../../../domains';
import { truncateTables } from '../../../../../../shared/tests/truncateTables';
import { disconnectDB } from '../../../../../../infrastructure/typeorm/config';
import { UsersFactory } from '../../../../../../shared/tests/factories/UsersFactory';
import { TasksFactory } from '../../../../../../shared/tests/factories/TasksFactory';

const logger = pino();

afterAll(async () => {
  await disconnectDB();
});

describe('tasks integration tests', () => {
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

  afterEach(async () => {
    await truncateTables();
  });

  it('finds task by Id', async () => {
    const userAttr = {
      login: 'login',
      email: 'email'
    };

    const user = await UsersFactory.create(userAttr);

    const taskAttr = {
      title: 'title',
      description: 'description',
      createdByUserId: user.id
    };

    const task = await TasksFactory.create(taskAttr);
    const testQuery = `
    query TaskQuery($id: Int!){
      task(id: $id) {
        id
        title
        description
        status
      }
    }
  `;
    const { query }: ApolloServerTestClient = createTestClient(server);

    const result = await query({
      query: testQuery,
      variables: { id: task.id }
    });
    expect(result.data.task).toMatchObject({
      id: expect.any(Number),
      title: 'title',
      description: 'description',
      status: 'ToDo'
    });
  });

  it('returns users data', async () => {
    const userAttr = {
      login: 'login',
      email: 'email'
    };

    const user = await UsersFactory.create(userAttr);

    const taskAttr = {
      title: 'title',
      description: 'description',
      createdByUserId: user.id
    };

    await TasksFactory.createList(3, taskAttr);

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
    expect(res.data.tasks.length).toEqual(3);
  });
});
