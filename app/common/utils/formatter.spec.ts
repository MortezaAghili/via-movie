import { ExtractMovieID, GetTrailerInfo } from "./formatter";

describe("The ExtractMovieID Tests", () => {
  it("should return null when argument is null", () => {
    const result = ExtractMovieID(null);
    expect(result).toEqual(null);
  });

  it("should extract a valid movie ID", () => {
    const item = {
      _embedded: {
        "viaplay:blocks": [
          {
            _embedded: {
              "viaplay:product": {
                content: {
                  imdb: {
                    id: "movieID",
                  },
                },
              },
            },
          },
        ],
      },
    };

    const result = ExtractMovieID(item);
    expect(result).toEqual("movieID");
  });
});

describe("The GetTrilerInfo Tests", () => {
  it("should return Correct video name", () => {
    const item = {
      results: [
        {
          name: "Video test 1",
          site: "Youtube",
          key: "aosdaskda",
        },
      ],
    };
    const result = GetTrailerInfo(item);
    expect(result.name).toEqual("Video test 1");
  });

  it("should return Correct video youtube url", () => {
    const item = {
      results: [
        {
          name: "Video test 1",
          site: "Youtube",
          key: "aosdaskda",
        },
      ],
    };
    const result = GetTrailerInfo(item);
    expect(result.link).toContain("youtube");
  });
});
