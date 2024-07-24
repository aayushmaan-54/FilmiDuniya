import {
  Link,
  useNavigate,
  useParams
} from "react-router-dom";

import "./MovieInformation.css";

import {
  useGetMovieByIdQuery,
  useGetMovieRecommendationsQuery,
  useGetWatchlistFavoritesMoviesQuery
} from "../../Redux/Services/Services";

import {
  Movie,
  MovieByID,
  MoviesResponse,
  MovieTrailerType
} from "../../Types/types";

import { GenresIcons } from "../../Global/Layout/NavBar/Icons";

import { selectGenreOrCategory } from "../../Redux/Slices/TMDB_API";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  SetStateAction,
  useEffect,
  useState
} from "react";

import {
  Loading,
  Error,
  StarRating,
  CarouselImg,
  MovieTrailerModal,
  Heart,
  CirclePlus,
  Back,
  CircleMinus,
  Globe,
  MovieFilmStrip,
  YouTube,
  LazyImg,
  InfoTopRightToast
} from "../../Global/exports";

import { BASE_URL } from "../../Config/url";

import axios from "axios";

import { RootState } from "../../Redux/Store";

import TransparentLoader from "../Loading/TransparentLoader";

import moviePlaceholder from "../../assets/images/moviePlaceholder.webp"


const MovieInformation = () => {

  const { movieID } = useParams();
  const { data, error, isFetching } = useGetMovieByIdQuery(movieID);
  const MovieByID: MovieByID = data;

  const dispatch = useDispatch();

  const [isMovieFavorite, setIsMovieFavorite] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const navigate = useNavigate();

  const AuthUserId = useSelector((state: RootState) => state.user.user);
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);

  const { data: favoriteMovieData } = useGetWatchlistFavoritesMoviesQuery({
    listName: 'favorite/movies',
    accountID: AuthUserId?.id,
    sessionID: localStorage.getItem("SessionID_TMDB")
  })

  const { data: watchlistMovieData } = useGetWatchlistFavoritesMoviesQuery({
    listName: 'watchlist/movies',
    accountID: AuthUserId?.id,
    sessionID: localStorage.getItem("SessionID_TMDB")
  })

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setIsMovieFavorite(!!favoriteMovieData?.results?.find((movie: Movie) => movie?.id === data?.id));
  }, [data?.id, favoriteMovieData]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovieData?.results?.find((movie: Movie) => movie?.id === data?.id));
  }, [data?.id, watchlistMovieData?.results]);

  const { data: recommendationData, isFetching: isRecommendationsFetching } = useGetMovieRecommendationsQuery({ movieID: movieID, list: '/recommendations' })
  const movierecommendations: MoviesResponse = recommendationData;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailerVideoId, setTrailerVideoId] = useState('');
  const [availableTrailers, setAvailableTrailers] = useState<MovieTrailerType[]>([]);

  const getMovieTrailers = (videos: MovieTrailerType[]) => {
    if (videos) {
      return videos.filter(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
    }
    return [];
  };


  const [isUpdating, setIsUpdating] = useState(false);


  const watchlistHandler = async () => {
    if (!isAuth) {
      setShowToast(true);
      return;
    }
    setIsUpdating(true);
    const ADD_TO_WATCHLIST_ENDPOINT = `${BASE_URL}/account/${AuthUserId?.id}/watchlist?api_key=${import.meta.env.VITE_TMDB_API_KEY}&session_id=${localStorage.getItem("SessionID_TMDB")}`;

    try {
      await axios.post(ADD_TO_WATCHLIST_ENDPOINT, {
        media_type: 'movie',
        media_id: movieID,
        watchlist: !isMovieWatchlisted,
      });

      setIsMovieWatchlisted(!isMovieWatchlisted);
    } catch (error) {
      console.error("Error updating watchlist:", error);
    } finally {
      setIsUpdating(false);
    }
  }


  const favoriteMovieHandler = async () => {
    if (!isAuth) {
      setShowToast(true);
      return;
    }
    setIsUpdating(true);
    const ADD_TO_favorite_ENDPOINT = `${BASE_URL}/account/${AuthUserId?.id}/favorite?api_key=${import.meta.env.VITE_TMDB_API_KEY}&session_id=${localStorage.getItem("SessionID_TMDB")}`;

    try {
      await axios.post(ADD_TO_favorite_ENDPOINT, {
        media_type: 'movie',
        media_id: movieID,
        favorite: !isMovieFavorite,
      });

      setIsMovieFavorite(!isMovieFavorite);
    } catch (error) {
      console.error("Error updating favorite status:", error);
    } finally {
      setIsUpdating(false);
    }
  };


  useEffect(() => {
    if (MovieByID && MovieByID.videos) {
      const trailers: MovieTrailerType[] = getMovieTrailers(MovieByID.videos.results);
      setAvailableTrailers(trailers.reverse());
    }
  }, [MovieByID]);


  const openTrailer = (videoId: SetStateAction<string>) => {
    setTrailerVideoId(videoId);
    setIsModalOpen(true);
  };


  const closeTrailer = () => {
    setIsModalOpen(false);
  };

  if (isFetching) return <Loading />;
  if (error) return <Error />;


  return (
    <section className="relative pt-24">
      {isUpdating && <TransparentLoader />}
      <div className="w-screen flex items-center justify-center pt-10 pb-5">
        <img
          src={
            MovieByID?.poster_path
              ? `https://image.tmdb.org/t/p/w500/${data?.poster_path}`
              : moviePlaceholder
          }
          alt={MovieByID.title}
          className="w-[350px] rounded-3xl shadow-2xl movie-img"
        />
      </div>

      <div className="text-center">
        <h1 className="text-3xl text-center pb-2 px-3">{MovieByID.title} ({MovieByID.release_date.split('-')[0]})</h1>
        <p className="px-6">{MovieByID.tagline}</p>
        <span className="flex flex-wrap items-center justify-evenly pb-8 px-6 movie-rating-details">
          <div className="flex items-center justify-center gap-1 pt-7 star-rating text-nowrap">
            <StarRating rating={MovieByID.vote_average} />
            ({MovieByID.vote_average} / 10)
          </div>
          <p className="pt-7">{MovieByID.runtime} min / ({MovieByID.origin_country.join(', ')} , {MovieByID.spoken_languages[0].name})</p>
        </span>
        <div className="flex items-center justify-center flex-wrap">
          {MovieByID.genres.map((genre) => {
            const Icon = GenresIcons[genre.name];
            return (
              <div key={genre.id} className="flex flex-wrap px-10 items-center cursor-pointer group pb-4" onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
                <Link to={'/'} className="flex items-center justify-center gap-1">
                  {Icon && <Icon className="size-7 group-hover:dark:stroke-contrastDark group-hover:stroke-contrastLight" />}
                  <span className="text-lg font-semibold group-hover:dark:text-contrastDark group-hover:text-contrastLight">{genre.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="overview pt-7 flex flex-col justify-center mx-auto overview-container">
          <h1 className="text-3xl text-left font-semibold">Overview</h1>
          <p className="text-left">{MovieByID.overview}</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold mt-8 mb-4">Cast</h2>
          {MovieByID && MovieByID.credits && MovieByID.credits.cast && (
            <CarouselImg cast={MovieByID.credits.cast} />
          )}
        </div>
        <div>
          <div className="flex items-center justify-center gap-14 mt-12">
            <a href={`${MovieByID.homepage}`} target="_blank" className="flex items-center justify-center gap-1 group dark:hover:text-contrastDark hover:text-contrastLight"><Globe className="mb-1 dark:group-hover:stroke-contrastDark hover:stroke-contrastLight" />Website</a>
            <a href={`https://www.imdb.com/title/${MovieByID.imdb_id}`} target="_blank" className="flex items-center justify-center gap-1 group dark:hover:text-contrastDark hover:text-contrastLight"><MovieFilmStrip className="mb-1 dark:group-hover:stroke-contrastDark hover:stroke-contrastLight" />IMDB</a>
          </div>
          <div className="pl-7">
            <h2 className="text-3xl font-bold flex items-center justify-start gap-3 pt-10 pb-3"><YouTube className="size-8" />Trailers</h2>
            {availableTrailers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableTrailers.map((trailer: MovieTrailerType) => (
                  <button
                    key={trailer.id}
                    onClick={() => openTrailer(trailer.key)}
                    className="dark:bg-contrastDark bg-contrastLight dark:hover:bg-[#a00a0a] font-bold py-2 px-4 rounded text-white hover:bg-[#4a46c0]"
                  >
                    {trailer.name}
                  </button>
                ))}
              </div>
            ) : (
              <p>No trailers available for this movie.</p>
            )}
            <MovieTrailerModal
              isOpen={isModalOpen}
              onClose={closeTrailer}
              videoId={trailerVideoId}
            />
          </div>

        </div>
        <div className="flex  items-center justify-center gap-12 py-10 movie-add-links">
          <a onClick={favoriteMovieHandler} className="cursor-pointer flex items-center justify-center gap-1 group">
            {!isMovieFavorite ? (
              <>
                <Heart className="stroke-contrastDark dark:group-hover:stroke-contrastDark hover:stroke-contrastLight" />
                <span className="group-hover:dark:text-contrastDark group-hover:text-contrastLight">favorite</span>
              </>
            ) : (
              <>
                <Heart className="stroke-contrastDark fill-contrastDark dark:group-hover:stroke-contrastDark hover:stroke-contrastLight" />
                <span className="group-hover:dark:text-contrastDark group-hover:text-contrastLight">Unfavorite</span>
              </>
            )}
          </a>
          <a onClick={watchlistHandler} className="cursor-pointer flex items-center justify-center gap-1 group">
            {!isMovieWatchlisted ? (
              <>
                <CirclePlus className="group-hover:dark:stroke-contrastDark group-hover:stroke-contrastLight" />
                <span className="group-hover:dark:text-contrastDark group-hover:text-contrastLight">Watchlist</span>
              </>
            ) : (
              <>
                <CircleMinus className="group-hover:dark:stroke-contrastDark group-hover:stroke-contrastLight" />
                <span className="group-hover:dark:text-contrastDark group-hover:text-contrastLight">Not interested</span>
              </>
            )}</a>
          <a onClick={() => navigate(-1)} className="cursor-pointer flex items-center justify-center group">
            <Back className="dark:group-hover:stroke-contrastDark group-hover:stroke-contrastLight dark:group-hover:fill-contrastDark group-hover:fill-contrastLight" />
            <span className="group-hover:dark:text-contrastDark group-hover:text-contrastLight">back</span>
          </a>
        </div>
        <div>
          <h1 className="text-3xl font-semibold pb-4 recomendations-heading">You might also like: </h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
            {isRecommendationsFetching ? (
              <Loading />
            ) : movierecommendations.total_results === 0 ? (
              <p className="text-lg w-screen font-bold">No recommendations available</p>
            ) : (
              movierecommendations.results.map((movie) => (
                <div key={movie.id} className="flex flex-col items-center w-full pb-5 px-5">
                  <Link to={`/movie/${movie.id}`} className="w-full group">
                    <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg">
                      <LazyImg
                        src={movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                          : moviePlaceholder}
                        alt={movie.title}
                        className="object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                    </div>
                    <h2 className="mt-1 text-xs sm:text-sm font-medium text-center px-1">
                      <span className="relative inline-block max-w-full">
                        <span className="truncate block dark:group-hover:text-contrastDark group-hover:text-contrastLight">
                          {movie.title}
                        </span>
                        <span className="absolute bottom-0 left-0 w-full h-0.5 dark:bg-contrastDark bg-contrastLight transform scale-x-0 transition-transform duration-300 ease-in-out group-hover:scale-x-100 origin-left"></span>
                      </span>
                    </h2>
                  </Link>
                  <span className="flex items-center justify-center">
                    <StarRating rating={movie.vote_average} />
                    <h3 className="text-s mt-1 star-rating">({(movie.vote_average / 2).toFixed(1)})</h3>
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div >
      {showToast && (
        <InfoTopRightToast
          message="Login to use this feature"
          duration={5000}
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  )
}


export default MovieInformation;