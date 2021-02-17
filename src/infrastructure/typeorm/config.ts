import { createConnection, getConnection } from 'typeorm';
import { IConnectionSettings } from '../../shared/interfaces/ISettings';

export async function connectDB(
  connectionMane: string,
  settings: IConnectionSettings,
  entities
) {
  await createConnection({
    name: connectionMane,
    type: settings.type,
    host: settings.host,
    username: settings.username,
    password: settings.password,
    database: settings.database,
    synchronize: settings.synchronize,
    entities: entities
  });
}

export const disconnectDB = async (): Promise<void> => {
  if (getConnection()) {
    await getConnection().close();
  }
};
