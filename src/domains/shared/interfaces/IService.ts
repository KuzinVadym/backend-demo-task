import { Logger } from 'pino';

export interface IService {
  name: string;
  logger: Logger;
}
