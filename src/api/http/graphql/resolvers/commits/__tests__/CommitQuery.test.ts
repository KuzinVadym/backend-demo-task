import 'reflect-metadata';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { CommitQuery } from '../CommitQuery';

const contextMock = {
  getState: jest.fn()
};

const commitsServiceMock = {
  getCommits: jest.fn(),
  getCommit: jest.fn()
};

describe('CommitQuery', () => {
  let server: ApolloServer;

  beforeAll(async () => {
    const schema = await buildSchema({ resolvers: [CommitQuery] });
    server = new ApolloServer({
      schema,
      context: contextMock
    });
  });

  beforeEach(async () => {
    commitsServiceMock.getCommits.mockResolvedValue([
      {
        userId: 1,
        taskId: 1,
        status: 'ToDo',
        createdAt: new Date()
      }
    ]);
    commitsServiceMock.getCommit.mockResolvedValue({
      userId: 1,
      taskId: 1,
      status: 'ToDo',
      createdAt: new Date()
    });

    contextMock.getState.mockReturnValue({
      httpServices: {
        commits: commitsServiceMock
      }
    });
  });

  it('returns tasks data', async () => {
    const testQuery = `{
      commits {
        taskId
        userId
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
    query CommitQuery($id: Int!){
      commit(id: $id) {
        taskId
        userId
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
    query CommitQuery($id: Int!){
      commit(id: $id) {
        taskId
        userId
        status
      }
    }
  `;
    const { query }: ApolloServerTestClient = createTestClient(server);

    await query({ query: testQuery, variables: { id: 1 } });

    expect(commitsServiceMock.getCommit).toBeCalledWith(1);
  });
});
