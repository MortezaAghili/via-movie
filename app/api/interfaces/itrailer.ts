import { Observable } from "rxjs";
import { Trailer } from "../models";

/**
 * Trailer Service Interface
 */
interface ITrailer {
  trailerbyMovieId(id: string): Observable<Trailer>;
}

export default ITrailer;
