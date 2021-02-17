import pino from 'pino';
import { settings } from './settings';
import { AppServer } from './rootService';
import { createHttpServices } from './domains';
import { initOrmEntities } from './infrastructure/entities';

const logger = pino();

(async () => {
  try {
    const appSrv = new AppServer(settings, logger);
    logger.info('Starting HTTP server');

    await appSrv.withDB(initOrmEntities());

    appSrv.withHttpServices(createHttpServices());

    await appSrv.init();

    appSrv.listen();
  } catch (e) {
    logger.error(e, 'An error occurred while initializing application.');
  }
})();
