import "reflect-metadata";
import * as cluster from 'cluster';
import * as os from 'os';
import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
const createSwaggerMiddleware = require('swagger-express-middleware');

import './common/env';
import Server from './common/server';
import { swaggerify } from './common/configs';

// Single Node execution
// tslint:disable:no-console
const welcome = (port: string) =>
  console.log(
    `up and running in 
    ${
      process.env.NODE_ENV || 'development'
    } @: ${os.hostname()} on port: ${port}`
  );

const setupServer = () => {
  // create the server
  const exApp = express();
  const swaggerFile = path.join(__dirname, './common/swagger/Api.yaml');
  createSwaggerMiddleware(swaggerFile, exApp, (err, middleware) => {
    swaggerify(exApp, middleware);
    const app = new Server(exApp).getServer().build();
    const sw = http.createServer(app);
    sw.listen(process.env.PORT, (err?: Error) => {
      if (err) {
        throw err;
      }
      welcome(process.env.PORT);
    });
  });
};

const setupCluster = () => {
  const numWorkers = require('os').cpus().length;
  console.log(
    `The master cluster setup ${numWorkers} workers to handle the load balance!`
  );

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Now, Worker with PID: ${worker.process.pid} is ready to serve commands!`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Oops! Worker number ${worker.process.pid} exited with code ${code} and signal ${signal}`
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
};

// Run the server in Cluster mode!
if (process.env.CLUSTER_MODE === 'true' && cluster.isMaster) {
  setupCluster();
} else {
  setupServer();
}
