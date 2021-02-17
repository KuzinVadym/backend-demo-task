import { MysqlConnectionCredentialsOptions } from 'typeorm/driver/mysql/MysqlConnectionCredentialsOptions';

type IDataBaseSettings = Pick<
  MysqlConnectionCredentialsOptions,
  'database' | 'username' | 'password' | 'host' | 'port'
>;

export interface IConnectionSettings extends IDataBaseSettings {
  type: 'mysql' | 'mariadb';
  synchronize: boolean;
}

export interface ISettings {
  port: string;
  database: IConnectionSettings;
}
