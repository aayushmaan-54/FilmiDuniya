import { useEffect, useState } from 'react';

import { useGetMoviesQuery } from "../../Redux/Services/Services";

import "./Home.css";

import {
  Loading,
  Error,
  MovieList,
  Next,
  Previous,
  FeaturedMovies,
} from "../../Global/exports";

import {
  useSelector,
  useDispatch
} from "react-redux";

import { RootState } from "../../Redux/Store";

import {
  nextPage,
  previousPage,
  setPage
} from '../../Redux/Slices/TMDB_API';


const Home = () => {

  const dispatch = useDispatch();
  const { genreIdOrCategoryName, page, searchQuery } = useSelector((state: RootState) => state.currentGenreOrCategory);
  const { data, error, isFetching } = useGetMoviesQuery({ genreIdOrCategoryName, page, searchQuery });
  const [jumpToPage, setJumpToPage] = useState('');


  const [visibleMovies, setVisibleMovies] = useState(15);

  const updateVisibleMovies = () => {
    const width = window.innerWidth;
    if (width >= 1024) {
      setVisibleMovies(16);
    } else if (width >= 768) {
      setVisibleMovies(17);
    } else {
      setVisibleMovies(20);
    }
  };


  useEffect(() => {
    updateVisibleMovies();
    window.addEventListener('resize', updateVisibleMovies);
    return () => window.removeEventListener('resize', updateVisibleMovies);
  }, []);


  if (isFetching) return <Loading />;
  if (error) return <Error />;

  const handleNextPage = () => {
    dispatch(nextPage());
  };


  const handlePreviousPage = () => {
    dispatch(previousPage());
  };


  const handleJumpToPage = () => {
    const pageNumber = parseInt(jumpToPage);
    if (pageNumber && pageNumber > 0 && pageNumber <= (data?.total_pages || 1)) {
      dispatch(setPage(pageNumber));
    }
    setJumpToPage('');
  };


  return (
    <div className="flex flex-col items-center pb-7">
      <FeaturedMovies movie={data?.results[0]} />
      {data && <MovieList movies={data?.results} excludeFirst={true} numberOfMovies={visibleMovies} />}
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-contrastLight text-white rounded dark:bg-contrastDark disabled:bg-[#2b2975] dark:disabled:bg-[#660718] disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Previous />
        </button>
        <span className="self-center">Page {page} of {data?.total_pages || 1}</span>
        <button
          onClick={handleNextPage}
          disabled={!data || page === data?.total_pages}
          className="px-4 py-2 bg-contrastLight text-white rounded dark:bg-contrastDark disabled:bg-[#2b2975] dark:disabled:bg-[#660718] disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <Next />
        </button>
      </div>
      <div className="mt-4">
        <input
          type="number"
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          placeholder="Jump to page"
          className="px-2 py-2 rounded w-[150px] shadow outline-none outline-1 dark:outline-contrastDark outline-offset-0 dark:bg-tertiaryDark focus:ring-2 dark:focus:ring-contrastDark outline-contrastLight focus:ring-contrastLight"
        />
        <button
          onClick={handleJumpToPage}
          className="ml-2 px-4 py-2 dark:bg-contrastDark bg-contrastLight text-white rounded"
        >
          Go
        </button>
      </div>
    </div>
  )
}

export default Home;