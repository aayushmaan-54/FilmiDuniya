import {
  Link,
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

import "./Actor.css";

import {
  useGetActordetailsQuery,
  useGetMoviesByActorIdQuery
} from "../../Redux/Services/Services";

import {
  ActorDetailsData,
  Movie
} from "../../Types/types";

import {
  Back,
  Error,
  LazyImg,
  Loading,
  MovieFilmStrip,
  StarRating
} from "../../Global/exports";

import castPlaceholder from "../../assets/images/placeholderPeople.webp"

import moviePlaceholder from "../../assets/images/moviePlaceholder.webp"
import { useEffect } from "react";


const Actor = () => {

  const { actorID } = useParams();
  const { data, error, isFetching } = useGetActordetailsQuery(actorID);
  const navigate = useNavigate();
  const { data: ActorMovieData, error: ActorMovieError, isFetching: ActorMovieIsFetching } = useGetMoviesByActorIdQuery({ actorID });

  const location = useLocation();

  const actorDetails: ActorDetailsData = data;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);


  if (!actorDetails) return <Loading />;
  if (isFetching) return <Loading />;
  if (error) return <Error />;

  const actorMovie: Movie[] = ActorMovieData?.results;

  return (
    <section className="flex flex-col items-center justify-center pt-24">
      <div>
        <LazyImg
          src={actorDetails?.profile_path
            ? `https://image.tmdb.org/t/p/w500/${actorDetails?.profile_path}`
            : castPlaceholder
          }
          alt={actorDetails?.name}
          className="w-[350px] rounded-3xl pb-3 actor-movie"
        />
      </div>

      <div className="actor-detail-container">
        <div className="pb-4">
          <h1 className="text-3xl font-bold text-center pb-2">
            {actorDetails?.name} ({actorDetails?.known_for_department})
          </h1>
          <div className="flex gap-2">
            {actorDetails?.also_known_as && actorDetails?.also_known_as?.length > 0 ? (
              <>
                <h3 className="text-nowrap">Also Known as:</h3>
                <span>{actorDetails?.also_known_as.join(", ")}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="text-left w-full text-xl pb-4">
          <h1>Born: <span className="dark:text-darkText text-lightText">{new Date(actorDetails?.birthday).toDateString()}</span></h1>
          {actorDetails?.deathday && (
            <h1>Died: <span className="dark:text-darkText text-lightText">{new Date(actorDetails?.deathday).toDateString()}</span></h1>
          )}
        </div>
        <div>
          <p className="mb-14"><span className="dark:text-white text-black">Biography: </span>{actorDetails?.biography}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-7 pb-10">
        <a href={`https://www.imdb.com/name/${actorDetails?.imdb_id}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 group dark:hover:text-contrastDark hover:text-contrastLight">
          <MovieFilmStrip className="mb-1 dark:group-hover:stroke-contrastDark hover:stroke-contrastLight" />
          IMDB
        </a>
        <a onClick={() => navigate(-1)} className="cursor-pointer flex items-center justify-center group">
          <Back className="dark:group-hover:stroke-contrastDark group-hover:stroke-contrastLight dark:group-hover:fill-contrastDark group-hover:fill-contrastLight" />
          <span className="group-hover:dark:text-contrastDark group-hover:text-contrastLight">back</span>
        </a>
      </div>

      <div>
        {ActorMovieIsFetching ? (
          <Loading />
        ) : ActorMovieError ? (
          <Error />
        ) : ActorMovieData ? (
          <>
            <h1 className="text-3xl font-bold pl-4 pb-4">Top Movies: </h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-6">
              {actorMovie.map((movie: Movie) => (
                <div key={movie?.id} className="flex flex-col items-center w-full pb-5 px-5">
                  <Link to={`/movie/${movie?.id}`} className="w-full group">
                    <div className="aspect-w-2 aspect-h-3 w-full overflow-hidden rounded-lg">
                      <img
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
                    <StarRating rating={movie?.vote_average} />
                    <h3 className="text-s mt-1 star-rating">({(movie?.vote_average / 2).toFixed(1)})</h3>
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>

    </section>
  )
}

export default Actor;