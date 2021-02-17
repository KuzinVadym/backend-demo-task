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

describe('updates tasks', () => {
  let server: ApolloServer;
  let createdTask;
  let user;
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
    user = await UsersFactory.create();

    const createMutation = `
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

    createdTask = await mutate({
      mutation: createMutation,
      variables: {
        input: {
          title: 'title',
          description: 'description',
          createdByUserId: user.id
        }
      }
    });
  });

  afterEach(async () => {
    await truncateTables();
  });

  it('updates task', async () => {
    const updateMutation = `
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

    const updateResult = await mutate({
      mutation: updateMutation,
      variables: {
        input: {
          id: createdTask.data.createTask.id,
          title: 'newtitle',
          description: 'newdescription',
          updatedByUserId: user.id
        }
      }
    });

    expect(updateResult.data.updateTask).toMatchObject({
      id: createdTask.data.createTask.id,
      title: 'newtitle',
      description: 'newdescription',
      status: 'ToDo'
    });
  });

  it('not updates task in transition not allowed', async () => {
    const updateMutation = `
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

    const updateResult = await mutate({
      mutation: updateMutation,
      variables: {
        input: {
          id: createdTask.data.createTask.id,
          title: 'newtitle',
          description: 'newdescription',
          status: 'Abrakadabra',
          updatedByUserId: user.id
        }
      }
    });

    expect(updateResult.errors[0].message).toEqual(
      'Unallowed Transition ToDo -> Abrakadabra'
    );
  });

  it('assigns another user for the task', async () => {
    const newUser = await UsersFactory.create();

    const updateMutation = `
      mutation UpdateTaskMutation($input: UpdateTaskInput!){
        updateTask(input: $input) {
          id
        }
      }
    `;

    const { mutate }: ApolloServerTestClient = createTestClient(server);

    const updateResult = await mutate({
      mutation: updateMutation,
      variables: {
        input: {
          id: createdTask.data.createTask.id,
          updatedByUserId: user.id,
          assignedUserId: newUser.id
        }
      }
    });

    expect(updateResult.data.updateTask).toMatchObject({
      id: createdTask.data.createTask.id
    });
  });
});
