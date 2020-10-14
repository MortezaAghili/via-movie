import { Observable, AsyncSubject, from, forkJoin } from "rxjs";
import { inject, injectable } from "inversify";
const rp: any = require("request-promise");

import SERVICE_IDENTIFIER from "../../common/constants/identifiers";
import ILogger from "../../common/interfaces/ilogger";
import { ITrailer } from "../interfaces";
import { Trailer } from "../models";

/**
 * Trailer Service Implementation
 */
@injectable()
class TrailerService implements ITrailer {
  public loggerService: ILogger;
  public constructor(
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger
  ) {
    this.loggerService = loggerService;
  }

  public trailerbyMovieId(id: string): Observable<Trailer> {
    const loadedDetail: AsyncSubject<Trailer> = new AsyncSubject<Trailer>();
    const endpoint = {
      method: "GET",
      uri: `${process.env.TMDB_BASE_URL}/${id}/videos?api_key=${process.env.TMDB_API_KEY}`,
      resolveWithFullResponse: true,
      json: true,
      time: true,
      timeout: process.env.API_TIME_OUT,
    };
    const detail: Observable<any> = from(rp(endpoint));
    forkJoin([detail]).subscribe(
      (results) => {
        this.loggerService.info(endpoint.uri, results[0].timings);
        const trailerDetail: Trailer = results[0].body;
        loadedDetail.next(trailerDetail);
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

export default TrailerService;
