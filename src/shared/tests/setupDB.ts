import { IConnectionSettings } from '../interfaces/ISettings';
import { initOrmEntities } from '../../infrastructure/entities';
import { connectDB, disconnectDB } from '../../infrastructure/typeorm/config';
import { truncateTables } from './truncateTables';

const testDBSettings: IConnectionSettings = {
  database: 'k2',
  type: 'mysql',
  username: 'k2',
  password: 'password',
  host: 'localhost',
  synchronize: true
};

export function setupDatabase(): void {
  beforeAll(async () => {
    await connectDB('default', testDBSettings, initOrmEntities());
    await truncateTables();
  });

  afterEach(async () => {
    await truncateTables();
  });

  afterAll(async () => {
    await disconnectDB();
  });
}
