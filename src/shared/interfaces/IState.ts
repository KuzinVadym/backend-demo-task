import { Logger } from 'pino';
import { IServices } from '../../domains/shared/interfaces/IServices';

export type ILogger = Logger;

export interface IState {
  logger?: ILogger;
  httpServices: IServices;
}
