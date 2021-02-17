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

  it('creates new task', async () => {
    const user = await UsersFactory.create();

    const testMutation = `
    mutation CreateTaskMutation($input: CreateTaskInput!){
      createTask(input: $input) {
        id
        title
        description
        status
      }
    }
  `;
    const { mutate }: ApolloServerTestClient = createTestClient(server);

    const result = await mutate({
      mutation: testMutation,
      variables: {
        input: {
          title: 'title',
          description: 'description',
          createdByUserId: user.id
        }
      }
    });

    expect(result.data.createTask).toMatchObject({
      id: expect.any(Number),
      title: 'title',
      description: 'description',
      status: 'ToDo'
    });
  });
});
