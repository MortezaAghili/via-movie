import { Observable } from "rxjs";
import { Film } from "../models";

/**
 * Film Service Interface
 */
interface IFilm {
  filmDetailById(id: string): Observable<Film>;
}

export default IFilm;
