import { GifsResult, GiphyFetch, SearchOptions, TrendingOptions } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { cacheFetch } from '../cache';

import { GifImageModel } from '../models/image/gifImage';

const apiKey = process.env.GIPHY_API_KEY || '';
const gf = new GiphyFetch(apiKey);

const DEFAULT_FETCH_COUNT = 16;

function convertResponseToModel(gifList: IGif[]): GifImageModel[] {
  return gifList.map((gif) => {
    const { id, title, images } = gif;

    return {
      id,
      title,
      imageUrl: images.original.url
    };
  });
}

export const gifAPIService = {
  /**
   * treding gif 목록을 가져옵니다.
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/trending
   */
  getTrending: async function (): Promise<GifImageModel[]> {
    const trendingOptions: TrendingOptions = {
      limit: DEFAULT_FETCH_COUNT,
      rating: 'g'
    };

    try {
      const gifs: GifsResult = await cacheFetch('trending', () => gf.trending(trendingOptions));

      return convertResponseToModel(gifs.data);
    } catch (e) {
      return [];
    }
  },
  /**
   * 검색어에 맞는 gif 목록을 가져옵니다.
   * @param {string} keyword
   * @param {number} page
   * @returns {Promise<GifImageModel[]>}
   * @ref https://developers.giphy.com/docs/api/endpoint#!/gifs/search
   */
  searchByKeyword: async function (keyword: string, page: number): Promise<GifImageModel[]> {
    const searchOptions: SearchOptions = {
      limit: DEFAULT_FETCH_COUNT,
      lang: 'En',
      offset: page * DEFAULT_FETCH_COUNT
    };

    try {
      const gifs: GifsResult = await cacheFetch(`search-${keyword}`, () =>
        gf.search(keyword, searchOptions)
      );
      return convertResponseToModel(gifs.data);
    } catch (e) {
      return [];
    }
  }
};
