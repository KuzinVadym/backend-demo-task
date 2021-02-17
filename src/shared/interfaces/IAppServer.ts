import { IServices } from '../../domains/shared/interfaces/IServices';
import { ApolloServer } from 'apollo-server-express';
import { IState } from './IState';

export interface IAppServer {
  init: () => Promise<void>;
  getState: () => IState;
  withDB: (entities: Function[]) => Promise<void>;
  withHttpServices: (services: IServices) => void;
  initTest: () => Promise<ApolloServer>;
  listen: () => void;
}
