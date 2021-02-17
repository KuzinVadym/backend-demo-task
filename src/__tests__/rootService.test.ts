import { AppServer } from '../rootService';
import { IConnectionSettings } from '../shared/interfaces/ISettings';
import pino from 'pino';

const logger = pino();

const testDBSettings: IConnectionSettings = {
  database: 'k2',
  type: 'mysql',
  username: 'k2',
  password: 'password',
  host: 'localhost',
  synchronize: true
};

describe('rootService', () => {
  let server = new AppServer(
    { port: '4000', database: testDBSettings },
    logger
  );

  it('successfully init ApolloServer', async () => {
    await expect(server.init()).resolves.not.toThrow();
  });
});
