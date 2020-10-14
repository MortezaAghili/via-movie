import { Request, Response } from "express";
import { inject } from "inversify";
import {
  controller,
  httpGet,
  interfaces,
  request,
  requestParam,
  response,
} from "inversify-express-utils";
import SERVICE_IDENTIFIER from "../../../common/constants/identifiers";
import { ILogger, IMetrics } from "../../../common/interfaces";
import {
  ExtractMovieID,
  GetTrailerInfo,
} from "../../../common/utils/formatter";
import { IFilm, ITrailer } from "../../interfaces";
import { APIResponse, HttpError } from "../../models";
import { ErrorResponseBuilder, HttpStatus } from "../../services";

/**
 * Trailer API Controller
 */
@controller("/trailer")
class TrailerController implements interfaces.Controller {
  public filmService: IFilm;
  public trailerService: ITrailer;
  public loggerService: ILogger;
  public metricsService: IMetrics;

  public constructor(
    @inject(SERVICE_IDENTIFIER.FILM) filmService: IFilm,
    @inject(SERVICE_IDENTIFIER.TRAILER) trailerService: ITrailer,
    @inject(SERVICE_IDENTIFIER.LOGGER) loggerService: ILogger,
    @inject(SERVICE_IDENTIFIER.METRICS) metricsService: IMetrics
  ) {
    this.filmService = filmService;
    this.trailerService = trailerService;
    this.loggerService = loggerService;
    this.metricsService = metricsService;
  }

  /**
   * Get Trailer by movie id
   * @param req
   * @param res
   */
  @httpGet("/movie/:id")
  public async getMovieTrailer(
    @requestParam("id") id: string,
    @request() req: Request,
    @response() res: Response
  ) {
    const result: APIResponse = await new Promise((resolve, reject) => {
      this.filmService.filmDetailById(id).subscribe(
        (result) => {
          // extract the movie ID from the result
          const movieID = ExtractMovieID(result);

          if (movieID) {
            // retrive the videos from TMDB API
            this.trailerService.trailerbyMovieId(movieID).subscribe(
              (trailerResult) => {
                // format the response
                const trailerObjectResult = GetTrailerInfo(trailerResult);

                // response to the client
                this.loggerService.logAPITrace(req, res, HttpStatus.OK);
                this.metricsService.logAPIMetrics(req, res, HttpStatus.OK);
                resolve({ data: trailerObjectResult, status: HttpStatus.OK });
              },
              (trailerError) => {
                const error: HttpError = trailerError as HttpError;
                const resp = new ErrorResponseBuilder()
                  .setTitle(error.name)
                  .setStatus(HttpStatus.NOT_FOUND)
                  .setDetail(error.stack)
                  .setMessage(error.message)
                  .setSource(req.url)
                  .build();
                res.status(HttpStatus.NOT_FOUND).json(resp);
                this.loggerService.logAPITrace(req, res, HttpStatus.NOT_FOUND);
                this.metricsService.logAPIMetrics(
                  req,
                  res,
                  HttpStatus.NOT_FOUND
                );
                reject({ errors: [resp], status: HttpStatus.NOT_FOUND });
              }
            );
          } else {
            reject({ errors: "NOT FOUND", status: HttpStatus.NOT_FOUND });
          }
        },
        (err) => {
          const error: HttpError = err as HttpError;
          const resp = new ErrorResponseBuilder()
            .setTitle(error.name)
            .setStatus(HttpStatus.NOT_FOUND)
            .setDetail(error.stack)
            .setMessage(error.message)
            .setSource(req.url)
            .build();
          res.status(HttpStatus.NOT_FOUND).json(resp);
          this.loggerService.logAPITrace(req, res, HttpStatus.NOT_FOUND);
          this.metricsService.logAPIMetrics(req, res, HttpStatus.NOT_FOUND);
          reject({ errors: [resp], status: HttpStatus.NOT_FOUND });
        }
      );
    });

    res.status(result.status).json(result);
  }
}
export default TrailerController;
