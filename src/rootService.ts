import 'reflect-metadata';
import http, { Server } from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import { getSchema } from './api/http/graphql/schema';
import { IAppServer } from './shared/interfaces/IAppServer';
import { ILogger, IState } from './shared/interfaces/IState';
import { ISettings } from './shared/interfaces/ISettings';
import { IServices } from './domains/shared/interfaces/IServices';
import { connectDB } from './infrastructure/typeorm/config';

export class AppServer implements IAppServer {
  private server: ApolloServer;
  private httpServer: Server;
  private logger: ILogger;
  private settings: ISettings;
  private httpServices: IServices;

  constructor(settings: ISettings, logger: ILogger) {
    this.settings = settings;
    this.logger = logger;
  }

  public getState(): IState {
    return {
      logger: this.logger,
      httpServices: this.httpServices
    };
  }

  public async withDB(entities): Promise<void> {
    await connectDB('default', this.settings.database, entities);
    this.logger.info('Connection with DB established');
  }

  withHttpServices(services: IServices) {
    this.httpServices = services;
  }

  async init(): Promise<void> {
    this.logger.info('Init Apollo Server');

    const getState = () => {
      return this.getState();
    };

    const app = express();

    const schema = await getSchema();

    this.server = new ApolloServer({
      schema,
      context: (context) => {
        return { getState };
      }
    });

    this.server.applyMiddleware({ app });

    this.httpServer = http.createServer(app);

    // server.installSubscriptionHandlers(this.httpServer);
  }

  async initTest(): Promise<ApolloServer> {
    this.logger.info('Init Apollo Server for tests');

    const getState = () => {
      return this.getState();
    };

    const schema = await getSchema();

    return new ApolloServer({
      schema,
      context: (context) => {
        return { getState };
      }
    });
  }

  listen(): void {
    this.httpServer.listen(this.settings.port, () => {
      this.logger.info(
        `🚀 Server ready at http://localhost:${this.settings.port}${this.server.graphqlPath}`
      );
    });
  }
}
