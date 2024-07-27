import { Link } from "react-router-dom";

import { Movie } from "../../Types/types";

import {
  LazyImg,
  StarRating
} from "../../Global/exports";

import "./MovieList.css";

import moviePlaceholder from "../../assets/images/moviePlaceholder.webp"

interface MovieListProps {
  movies: Movie[];
  excludeFirst: boolean
  numberOfMovies: number
}


const MovieList = ({ movies, excludeFirst, numberOfMovies }: MovieListProps) => {

  const startFrom = excludeFirst ? 1 : 0;

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 p-2 sm:p-4">
          {(movies.slice(startFrom, numberOfMovies)).map((movie) => (
            <div key={movie?.id} className="flex flex-col items-center w-full pb-5">
              <Link to={`/movie/${movie?.id}`} className="w-full group">
                <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg">
                  <LazyImg
                    src={movie?.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movie?.poster_path}`
                      : moviePlaceholder}
                    alt={movie?.title}
                    className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                </div>
                <h2 className="mt-1 text-xs sm:text-sm font-medium text-center px-1">
                  <span className="relative inline-block max-w-full">
                    <span className="truncate block dark:group-hover:text-contrastDark group-hover:text-contrastLight">
                      {movie?.title}
                    </span>
                    <span className="absolute bottom-0 left-0 w-full h-0.5 dark:bg-contrastDark bg-contrastLight transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 origin-left"></span>
                  </span>
                </h2>
              </Link>
              <span className="flex items-center justify-center">
                <StarRating rating={(movie?.vote_average)} />
                <h3 className="text-s mt-1 rating">({((movie?.vote_average) / 2).toFixed(1)})</h3>
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default MovieList;