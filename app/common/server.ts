import * as express from 'express';
import * as path from 'path';
import * as partialResponse from 'express-partial-response';
import apicache from 'apicache'
import { InversifyExpressServer } from 'inversify-express-utils';
const responseTime = require('response-time');

import {
  secureApp,
  configLogging,
  configMetrics,
  configHealthChecks,
  addCompression,
} from './configs';
import { IOCContainer } from "./configs/ioc_config";

/**
 * Server setup and configuration
 */
export default class ExpressServer {
  public server: InversifyExpressServer;

  constructor(exApp: any) {
    let root: string;

    // Setup application root
    root =
      process.env.NODE_ENV === 'development'
        ? path.normalize(__dirname + '/../..')
        : path.normalize('.');
    const container = IOCContainer.getInstance().getContainer();
    this.server = new InversifyExpressServer(
      container,
      undefined,
      {
        rootPath: '/api/v1',
      },
      exApp
    );
    this.server.setConfig((app) => {
      // Security configuration
      secureApp(app);

      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
        res.header(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content-Type, Accept'
        );
        next();
      });

      // Public folder
      app.use(express.static(`${root}/public`));

      // Response time support
      // Will add x-response-time
      app.use(responseTime({ suffix: false }));

      // Partial response support
      app.use(partialResponse());

      // Logging configuration
      configLogging(app);

      // Metrics configuration
      configMetrics(app);

      // Configure Healthchecks
      configHealthChecks(app);

      // Add Compression support
      addCompression(app);

      // Add Caching to all routes
      let cache = apicache.middleware
      app.use(cache(process.env.CACHE_DURATION))
    });
  }

  public getServer = (): InversifyExpressServer => {
    return this.server;
  };
}
