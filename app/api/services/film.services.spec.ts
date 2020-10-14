import "reflect-metadata";
import { IOCContainer } from "../../common/configs/ioc_config";
import SERVICE_IDENTIFIER from "../../common/constants/identifiers";
import "../../common/env";
import { ExtractMovieID } from "../../common/utils/formatter";
import { IFilm } from "../interfaces";

describe("Film Service Tests", () => {
  let filmService: IFilm;
  const testTimeOut = +process.env.TEST_TIME_OUT;
  beforeAll(() => {
    const container = IOCContainer.getInstance().getContainer();
    filmService = container.get<IFilm>(SERVICE_IDENTIFIER.FILM);
  });

  it(
    "should call and retrive correct information",
    (done) => {
      filmService
        .filmDetailById("transformers-dark-of-the-moon-2011")
        .subscribe(
          (res: any) => {
            expect(res.title).toContain("Transformers");
            done();
          },
          (error) => {
            fail(error);
            done();
          }
        );
    },
    testTimeOut
  );

  it(
    "should retrive correct Movie ID",
    (done) => {
      filmService
        .filmDetailById("transformers-dark-of-the-moon-2011")
        .subscribe(
          (res: any) => {
            const movieID = ExtractMovieID(res);
            expect(movieID).toEqual("tt1399103");
            done();
          },
          (error) => {
            fail(error);
            done();
          }
        );
    },
    testTimeOut
  );

  it(
    "should return null with wrong movie title",
    (done) => {
      filmService.filmDetailById("yes it is wrong").subscribe(
        (res: any) => {
          const movieID = ExtractMovieID(res);
          expect(movieID).toBeNull();
          done();
        },
        (error) => {
          fail(error);
          done();
        }
      );
    },
    testTimeOut
  );
});
