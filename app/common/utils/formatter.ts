import { Trailer } from "../../api/models";

export function ExtractMovieID(item: any): string {
  const data =
    item &&
    item._embedded["viaplay:blocks"][0]._embedded["viaplay:product"].content
      .imdb;
  return (data && data.id) || null;
}

export function GetTrailerInfo(item: any): Trailer {
  if (item.results && item.results.length > 0) {
    const _name = item.results[0].name;
    const _site = item.results[0].site;
    const _key = item.results[0].key;
    const res = {
      name: _name,
      link: urlFormatter(_site, _key),
    };
    return res;
  } else {
    return null;
  }
}

function urlFormatter(site: string, key: string): string {
  if (site.toLowerCase() === "youtube") {
    return `https://www.youtube.com/watch?v=${key}`;
  } else if (site.toLowerCase() === "viemo") {
    return `https://vimeo.com/${key}`;
  }
}
