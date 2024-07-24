import { Link } from "react-router-dom";

import { useGetMovieGenresQuery } from "../../../Redux/Services/Services";

import {
  Genre,
  GenresResponse
} from "../../../Types/types";

import {
  Close,
  Error,
  Loading
} from "../../exports";

import "./SideBar.css";

import {
  CategoriesIcons,
  GenresIcons
} from "./Icons";

import { useDispatch } from "react-redux";

import { selectGenreOrCategory } from "../../../Redux/Slices/TMDB_API";

type SideBarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
};

const SideBar = ({ isOpen, toggleSidebar, setIsSidebarOpen }: SideBarProps) => {

  const { data, error, isFetching } = useGetMovieGenresQuery();
  const genres: Genre[] = data ? (data as GenresResponse).genres : [];

  const dispatch = useDispatch();

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(selectGenreOrCategory(""));
    if (location.pathname !== '/') {
      window.location.href = '/';
      dispatch(selectGenreOrCategory("trending"));
    }
    setIsSidebarOpen(false);
  }

  const handleItemClick = (categoryOrGenreId: string | number) => {
    dispatch(selectGenreOrCategory(categoryOrGenreId));
    setIsSidebarOpen(false);
  };

  if (error) return <Error />;
  if (isFetching) return <Loading />;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      <nav className={`dark:bg-secondaryDark bg-contrastLight sidebar-container w-72 fixed h-screen transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} overflow-y-auto sidebar-container`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <img src="/favicon.webp" alt="Filmi Duniya icon" className="size-14" />
            <Link className="dark:text-contrastDark text-lg font-extrabold pl-2 text-white" to="/" onClick={handleLogoClick}>Filmi Duniya</Link>
          </div>
          <button onClick={toggleSidebar}>
            <Close className="text-white" />
          </button>
        </div>
        <hr />
        <div className="p-4 mt-10">
          <h3 className="font-bold mb-2 uppercase text-lg dark:text-contrastDark text-white">Categories</h3>
          <hr className="mb-1" />
          <ul className="space-y-2">
            {Object.entries(CategoriesIcons).map(([category, Icon]) => (
              <li key={category}>
                <Link
                  to={`/`}
                  className="flex items-center space-x-2 dark:hover:bg-complementDark p-2 rounded-lg dark:text-darkText text-white hover:bg-[#ffffff3f]"
                  onClick={() => handleItemClick(category)}
                >
                  {Icon && <Icon className="size-5" />}
                  <span>{category}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <h3 className="font-bold mb-2 uppercase text-lg dark:text-contrastDark text-white">Genres</h3>
          <hr className="mb-1" />
          <ul className="space-y-2">
            {genres.length > 0 && genres.map((genre) => {
              const Icon = GenresIcons[genre.name];
              return (
                <li key={genre.id}>
                  <Link
                    to={`/`}
                    className="flex items-center space-x-2 dark:hover:bg-complementDark p-2 rounded-lg dark:text-darkText text-white hover:bg-[#ffffff3f]"
                    onClick={() => handleItemClick(genre.id)}
                  >
                    {Icon && <Icon className="size-5" />}
                    <span>{genre.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default SideBar;