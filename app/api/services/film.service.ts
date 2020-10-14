import { Observable, AsyncSubject, from, forkJoin, of } from "rxjs";
import { inject, injectable } from "inversify";
const rp: any = require("request-promise");

import SERVICE_IDENTIFIER from "../../common/constants/identifiers";
import ILogger from "../../common/interfaces/ilogger";
import { IFilm } from "../interfaces";
import { Film } from "../models";

/**
 * Film Service Implementation
 */
@injectable()
class FilmService implements IFilm {
  public loggerService: ILogger;
  public constructor(
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
  ) {
    this.loggerService = loggerService;
  }

  public filmDetailById(id: string): Observable<Film> {
    const loadedDetail: AsyncSubject<Film> = new AsyncSubject<Film>();
    const endpoint = {
      method: "GET",
      uri: `${process.env.VIAPLAY_BASE_URL}/${id}`,
      resolveWithFullResponse: true,
      json: true,
      time: true,
      timeout: process.env.API_TIME_OUT,
    };

    const detail: Observable<any> = from(rp(endpoint));
    forkJoin([detail]).subscribe(
      (results) => {
        this.loggerService.info(endpoint.uri, results[0].timings);
        const filmDetail: Film = results[0].body;
        loadedDetail.next(filmDetail);
        loadedDetail.complete();
      },
      (error) => {
        this.loggerService.info(endpoint.uri, error);
        this.loggerService.info(endpoint.uri, error);
        loadedDetail.next(undefined);
        loadedDetail.complete();
      }
    );

    return loadedDetail;
  }
}

export default FilmService;
