/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect,
  useState
} from 'react';

import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

import {
  LazyImg,
  StarRating
} from "../../Global/exports";

import { useGetWatchlistFavoritesMoviesQuery } from "../../Redux/Services/Services";

import { RootState } from "../../Redux/Store";

import { Movie } from "../../Types/types";

import { getNewRequestToken } from "../../utils/utils";

import defaultProfile from "../../assets/images/profile.webp";

import "./Profile.css";

import moviePlaceholder from "../../assets/images/moviePlaceholder.webp";


const Profile = () => {

  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [visibleWishlistMovies, setVisibleWishlistMovies] = useState(7);
  const [visibleFavoriteMovies, setVisibleFavoriteMovies] = useState(7);

  const { data: favoriteMovieData, refetch: refetchFavorites } = useGetWatchlistFavoritesMoviesQuery({
    listName: 'favorite/movies',
    accountID: user?.id,
    sessionID: localStorage.getItem("SessionID_TMDB")
  });


  const { data: watchlistMovieData, refetch: refetchWatchlisted } = useGetWatchlistFavoritesMoviesQuery({
    listName: 'watchlist/movies',
    accountID: user?.id,
    sessionID: localStorage.getItem("SessionID_TMDB")
  });


  useEffect(() => {
    refetchFavorites();
    refetchWatchlisted();
  }, []);


  const showMoreWatchlist = () => {
    setVisibleWishlistMovies(prev => Math.min(prev + 7, watchlistMovieData?.results.length || 0));
  };


  const showMoreFavorites = () => {
    setVisibleFavoriteMovies(prev => Math.min(prev + 7, favoriteMovieData?.results.length || 0));
  };


  const hiddenWatchlistMovies = Math.max(0, (watchlistMovieData?.results.length || 0) - visibleWishlistMovies);
  const hiddenFavoriteMovies = Math.max(0, (favoriteMovieData?.results.length || 0) - visibleFavoriteMovies);


  const hasFavorites = favoriteMovieData && favoriteMovieData.results.length > 0;
  const hasWatchlist = watchlistMovieData && watchlistMovieData.results.length > 0;


  const MovieCard = ({ movie }: { movie: Movie }) => (
    <div className="flex flex-col h-full pb-6">
      <Link to={`/movie/${movie?.id}`} className="group flex-grow">
        <div className="aspect-w-2 aspect-h-3 mb-2">
          <LazyImg
            src={movie?.poster_path
              ? `https://image.tmdb.org/t/p/w200/${movie?.poster_path}`
              : moviePlaceholder}
            alt={movie?.title}
            className="object-cover w-full h-[300px] rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105 card-movies"
          />
        </div>
        <h2 className="text-sm font-semibold mt-1 mb-1 text-center">
          <span className="relative inline-block max-w-full">
            <span className="block dark:group-hover:text-contrastDark group-hover:text-contrastLight whitespace-nowrap overflow-hidden overflow-ellipsis text-center mx-auto">
              {movie?.title}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 dark:bg-contrastDark bg-contrastLight transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 origin-left"></span>
          </span>
        </h2>
      </Link>
      <div className="mt-auto flex items-center justify-center gap-1">
        <StarRating rating={movie?.vote_average} />
        <h3 className="text-xs mt-1 rating">({(movie?.vote_average / 2).toFixed(1)})</h3>
      </div>
    </div>
  );


  if (!isAuthenticated) {
    return (
      <section className="flex flex-col items-center justify-center my-[35vh]">
        <a
          className="rounded relative inline-flex group items-center justify-center px-3.5 py-2 m-1 cursor-pointer border-b-4 border-l-2 active:border-contrastDark active:shadow-none shadow-lg bg-gradient-to-tr from-contrastDark to-contrastDark border-[#6d0719] text-white"
          onClick={getNewRequestToken}
        >
          <span className="relative">Login</span>
        </a>
        <h2 className="text-lg font-semibold">Login to view content of Profile Page</h2>
      </section>
    );
  }


  return (
    <section className="flex flex-col items-center justify-center gap-7 pb-16">
      <div className="mt-20">
        <img
          src={
            user?.avatar?.tmdb?.avatar_path
              ? `https://image.tmdb.org/t/p/${user?.avatar?.tmdb?.avatar_path}`
              : user?.avatar.gravatar.hash
                ? `https://www.gravatar.com/avatar/${user?.avatar?.gravatar?.hash}`
                : `${defaultProfile}`
          }
          alt={`${user?.username} profile`}
          className="rounded-full border-4 dark:border-contrastDark border-contrastLight size-28 object-contain"
        />
      </div>

      <div className='pb-20'>
        <div className="flex items-center justify-evenly gap-1">
          <h2>Username:</h2>
          <p>{user?.username || 'Empty'}</p>
        </div>
        <div className="flex items-center justify-evenly gap-1">
          <h2>Name:</h2>
          <p>{user?.name || 'Empty'}</p>
        </div>
        <div className="flex items-center justify-evenly gap-1">
          <h2>Locale:</h2>
          <p>{user?.iso_3166_1 && user?.iso_639_1 ? `${user?.iso_3166_1}-${user?.iso_639_1}` : 'Empty'}</p>
        </div>
        <div className="flex items-center justify-evenly gap-1">
          <h2>ID:</h2>
          <p>{user?.id || 'Empty'}</p>
        </div>
      </div>

      <div className='w-screen px-7 mx-auto grid place-items-center'>
        <div className="w-full max-w-screen-lg pb-16">
          <h2 className="text-3xl font-semibold mb-4 text-left dark:text-contrastDark text-contrastLight">Favorites: </h2>
          {hasFavorites ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {favoriteMovieData.results.slice(0, visibleFavoriteMovies).map((movie: Movie) => (
                <MovieCard key={movie?.id} movie={movie} />
              ))}
              {hiddenFavoriteMovies > 0 && (
                <button
                  onClick={showMoreFavorites}
                  className="flex items-center justify-center aspect-w-2 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 h-[300px] card-movies"
                >
                  <span className="text-2xl font-bold">+{hiddenFavoriteMovies}</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-center text-lg">Add some items to your favorites to view them here.</p>
          )}
        </div>

        <div className='w-full max-w-screen-lg'>
          <h2 className="text-3xl font-semibold mb-4 text-left dark:text-contrastDark text-contrastLight">Watchlist: </h2>
          {hasWatchlist ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {watchlistMovieData?.results.slice(0, visibleWishlistMovies).map((movie: Movie) => (
                <MovieCard key={movie?.id} movie={movie} />
              ))}
              {hiddenWatchlistMovies > 0 && (
                <button
                  onClick={showMoreWatchlist}
                  className="flex items-center justify-center aspect-w-2 aspect-h-3 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 h-[300px] card-movies"
                >
                  <span className="text-2xl font-bold">+{hiddenWatchlistMovies}</span>
                </button>
              )}
            </div>
          ) : (
            <p className="text-center text-lg">Add some items to your watchlist to view them here.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;