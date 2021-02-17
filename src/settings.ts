import { config } from 'dotenv';
import { ISettings } from './shared/interfaces/ISettings';

const env: any = config().parsed;
const values = process.env.NODE_ENV === 'production' ? { ...env } : {};

const settings: ISettings = {
  port: values.PORT || 4000,
  database: {
    database: values.MYSQL_DATABASE || 'k2',
    type: values.TYPEORM_TYPE || 'mysql',
    username: values.MYSQL_USER || 'k2',
    password: values.MYSQL_PASSWORD || 'password',
    host: values.MYSQL_HOST || 'localhost',
    synchronize: values.TYPEORM_SYNCHRONIZE
      ? values.TYPEORM_SYNCHRONIZE === 'true'
      : true
  }
};

export { settings };
