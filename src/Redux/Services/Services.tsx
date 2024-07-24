/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import {
  createApi,
  fetchBaseQuery
} from "@reduxjs/toolkit/query/react";

import {
  Genre,
  MovieByID,
  MoviesResponse
} from "../../Types/types";

export const BASE_URL = 'https://api.themoviedb.org/3';

const TMDB_ACCESS_TOKEN_AUTH = import.meta.env.
  VITE_TMDB_ACCESS_TOKEN_AUTH;

function convertToSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '_');
}


export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('accept', 'application/json');
      headers.set('Authorization', `Bearer ${TMDB_ACCESS_TOKEN_AUTH}`);
      return headers;
    }
  }),

  endpoints: (builder) => ({
    getMovieGenres: builder.query<Genre, void>({
      query: () => `/genre/movie/list`
    }),

    getMovies: builder.query<MoviesResponse, { genreIdOrCategoryName?: string | number; page?: number }>({
      query: ({ genreIdOrCategoryName = "", page, searchQuery }) => {
        if (searchQuery && searchQuery.length > 0) {
          return `/search/movie?query=${searchQuery}&include_adult=true&language=en-US&page=${page}`
        }
        if (genreIdOrCategoryName === "trending") {
          return `/trending/movie/day?page=${page}&language=en-US`;
        }
        if (genreIdOrCategoryName === "" || genreIdOrCategoryName === undefined) {
          return `/trending/movie/day?page=${page}&language=en-US`;
        }
        if (typeof genreIdOrCategoryName === 'string') {
          return `/movie/${convertToSnakeCase(genreIdOrCategoryName)}?page=${page}&language=en-US`;
        }
        if (typeof genreIdOrCategoryName === 'number') {
          return `/discover/movie?with_genres=${genreIdOrCategoryName}&page=${page}&language=en-US`;
        }
        return `/trending/movie/day?page=${page}&language=en-US`;
      }
    }),

    getMovieById: builder.query<MovieByID, void>({
      query: (movieID) => `/movie/${movieID}?append_to_response=videos,credits&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
    }),

    getMovieRecommendations: builder.query<MoviesResponse, void>({
      query: ({ movieID, list }) => `/movie/${movieID}/${list}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
    }),

    getActordetails: builder.query<ActorDetailsData, void>({
      query: (actorID) => `/person/${actorID}?language=en-US`
    }),

    getMoviesByActorId: builder.query<any, void>({
      query: ({ actorID }) => `/discover/movie?with_cast=${actorID}&page=${1}&sort_by=vote_average.desc&api_key=${import.meta.env.VITE_TMDB_API_KEY}`
    }),

    getWatchlistFavoritesMovies: builder.query<any, void>({
      query: ({ listName, accountID, sessionID }) => `/account/${accountID}/${listName}?api_key=${import.meta.env.VITE_TMDB_API_KEY}&session_id=${sessionID}`
    }),
  })
});


export const {
  useGetMoviesQuery,
  useGetMovieGenresQuery,
  useGetMovieByIdQuery,
  useGetTrendingMovieOfDayQuery,
  useGetMovieRecommendationsQuery,
  useGetActordetailsQuery,
  useGetMoviesByActorIdQuery,
  useGetWatchlistFavoritesMoviesQuery,
}: {
  useGetMoviesQuery: any;
  useGetMovieGenresQuery: any;
  useGetMovieByIdQuery: any;
  useGetTrendingMovieOfDayQuery: any;
  useGetMovieRecommendationsQuery: any;
  useGetActordetailsQuery: any;
  useGetMoviesByActorIdQuery: any;
  useGetWatchlistFavoritesMoviesQuery: any;
} = tmdbApi;