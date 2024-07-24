import { Link } from "react-router-dom";
import { Movie } from "../../Types/types";
import "./FeaturedMovies.css";

interface FeaturedMoviesProps {
  movie: Movie;
}

const FeaturedMovies = ({ movie }: FeaturedMoviesProps) => {
  return (
    <Link to={`/movie/${movie.id}`} className="block relative overflow-hidden rounded-lg pb-4 w-full overflow-x-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 featured-movie-container">
      <div className="relative rounded-lg group overflow-hidden">
        <img
          src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
          alt={movie.title}
          className="w-[100vw] h-[500px] object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-110 featured-img"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end items-start p-4 rounded-lg object-cover w-full h-full transition-transform duration-300 ease-in-out group-hover:scale-110 img-black-alpha">
          <div className="relative z-10 transform transition-transform duration-300 ease-in-out group-hover:scale-[0.9090909091] mx-9 w-[70%] featured-img-content">
            <h1 className="text-white text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-white text-sm mb-6 featuredMovie-overview">{movie.overview}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default FeaturedMovies