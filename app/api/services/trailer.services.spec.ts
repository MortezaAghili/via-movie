import "reflect-metadata";
import { IOCContainer } from "../../common/configs/ioc_config";
import SERVICE_IDENTIFIER from "../../common/constants/identifiers";
import "../../common/env";
import { ITrailer } from "../interfaces";

describe("Trailer Service Tests", () => {
  let trailerService: ITrailer;
  const testTimeOut = +process.env.TEST_TIME_OUT;
  beforeAll(() => {
    const container = IOCContainer.getInstance().getContainer();
    trailerService = container.get<ITrailer>(SERVICE_IDENTIFIER.TRAILER);
  });

  it(
    "should call and retrive correct information",
    (done) => {
      trailerService.trailerbyMovieId("tt1399103").subscribe(
        (res: any) => {
          expect(res.results[0].name).toContain("Transformers");
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
    "should get undefiend result with wrong movie ID",
    (done) => {
      trailerService.trailerbyMovieId("wrongOne").subscribe(
        (res: any) => {
          expect(res).toBeUndefined();
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
