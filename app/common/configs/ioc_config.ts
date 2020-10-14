import { Container } from "inversify";

import LoggerMiddleware from "../middleware/logger-middleware";
import SERVICE_IDENTIFIER from "../constants/identifiers";
import { LogService, MetricsService } from "../services";
import { ILogger, IMetrics } from "../interfaces";

import { IFilm, ITrailer } from "../../api/interfaces";
import { FilmService, TrailerService } from "../../api/services";
import "../../api/controllers/trailer/controller";

/**
 * IOC Container - Singleton IOC container class
 * Initialized the IOC container and sets up all the container bindings
 */
export class IOCContainer {
  public static getInstance() {
    if (!IOCContainer.instance) {
      IOCContainer.instance = new IOCContainer();
      // Initialize the container
      const container = new Container();

      container.bind<IFilm>(SERVICE_IDENTIFIER.FILM).to(FilmService);
      container.bind<ITrailer>(SERVICE_IDENTIFIER.TRAILER).to(TrailerService);

      container
        .bind<ILogger>(SERVICE_IDENTIFIER.LOGGER)
        .to(LogService)
        .inSingletonScope();
      container
        .bind<IMetrics>(SERVICE_IDENTIFIER.METRICS)
        .to(MetricsService)
        .inSingletonScope();
      container
        .bind<LoggerMiddleware>(SERVICE_IDENTIFIER.LOGGER_MIDDLEWARE)
        .to(LoggerMiddleware);
      IOCContainer.instance.container = container;
    }
    return IOCContainer.instance;
  }

  private static instance: IOCContainer;
  private container: Container;
  private constructor() {}

  public getContainer(): Container {
    return this.container;
  }

  public setContainer(container: Container) {
    this.container = container;
  }
}
