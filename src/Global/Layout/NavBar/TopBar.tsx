import {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  MagnifyingGlass,
  MoonStars,
  Sun,
  Hamburger,
  useDebounce,
} from "../../exports";

import "./TopBar.css";

import {
  useDispatch,
  useSelector
} from "react-redux";

import {
  searchMovie,
  selectGenreOrCategory
} from "../../../Redux/Slices/TMDB_API";

import {
  createSessionID,
  getNewRequestToken,
  moviesAPI
} from "../../../utils/utils";

import { setUser } from "../../../Redux/Slices/Auth";

import { RootState } from "../../../Redux/Store";

import defaultProfile from "../../../assets/images/profile.webp";

import {
  Link,
  useLocation
} from "react-router-dom";

type TopBarProps = {
  isDark: boolean | null,
  setIsDark: React.Dispatch<React.SetStateAction<boolean | null>>,
  toggleSidebar: () => void
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}


const TopBar = ({ isDark, setIsDark, toggleSidebar, setIsSidebarOpen }: TopBarProps) => {

  const [searchInputVal, setSearchInputVal] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  const RequestToken = localStorage.getItem("RequestToken_TMDB");

  const debouncedSearchInput = useDebounce(searchInputVal, 500);

  useEffect(() => {
    if (debouncedSearchInput) {
      dispatch(searchMovie(debouncedSearchInput));
    }
  }, [debouncedSearchInput, dispatch]);

  useEffect(() => {
    const loginUser = async () => {
      if (RequestToken) {
        if (localStorage.getItem("SessionID_TMDB")) {
          const { data: userData } = await moviesAPI.get(`/account?session_id=${localStorage.getItem("SessionID_TMDB")}`);
          dispatch(setUser(userData))
        } else {
          const session_ID = await createSessionID();
          const { data: userData } = await moviesAPI.get(`/account?session_id=${session_ID}`);
          dispatch(setUser(userData))
        }
      }
    }
    loginUser();
  }, [RequestToken, dispatch]);


  const loginHandler = useCallback(() => {
    getNewRequestToken().catch(error => {
      console.error('Login error:', error);
    });
  }, []);


  useEffect(() => {
    if (searchInputVal.length === 0) {
      dispatch(searchMovie(""));
    }
  }, [searchInputVal, dispatch]);


  const themeHandler = useCallback(() => {
    setIsDark(prevIsDark => !prevIsDark);
  }, [setIsDark]);


  const toggleProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(prevIsOpen => !prevIsOpen);
  }, []);

  const logoutHandler = useCallback(() => {
    localStorage.clear();
    window.location.href = '/';
  }, []);


  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(selectGenreOrCategory(""));
    if (location.pathname !== '/') {
      window.location.href = '/';
      dispatch(selectGenreOrCategory("trending"));
      setIsSidebarOpen(false);
    }
  }, [location.pathname, dispatch, setIsSidebarOpen]);


  return (
    <header className="fixed top-0 right-0 left-0 z-30">
      <nav className="dark:bg-secondaryDark bg-contrastLight py-3 px-4 flex flex-wrap justify-between items-center nav-container">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="mr-4 menu">
            <Hamburger className="text-white" />
          </button>
          <h1 className="text-xl font-bold dark:text-contrastDark heading-logo text-white"><Link to={'/'} onClick={handleLogoClick}>Filmi Duniya</Link></h1>
        </div>

        <div className="flex items-center space-x-4 right-nav">
          <div className="relative search-input">
            <label htmlFor="search">
              <MagnifyingGlass className="dark:text-darkText absolute left-2 flex items-center top-[15%] s" />
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search..."
              value={searchInputVal}
              onChange={(e) => setSearchInputVal(e.target.value)}
              className="px-4 py-2 pl-10 rounded shadow outline-none outline-1 dark:outline-contrastDark outline-offset-0 dark:bg-tertiaryDark focus:ring-2 dark:focus:ring-contrastDark"
            />
          </div>

          <button onClick={themeHandler}>
            {isDark ? <Sun className="dark:text-contrastDark size-10 theme-icon" /> : <MoonStars className="text-white dark:text-darkText size-8 theme-icon" />}
          </button>

          <div className="relative">
            <img
              src={
                user?.avatar.tmdb.avatar_path
                  ? `https://image.tmdb.org/t/p/${user.avatar.tmdb.avatar_path}`
                  : user?.avatar.gravatar.hash
                    ? `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}`
                    : `${defaultProfile}`
              }
              alt="profile"
              className="size-10 rounded-full cursor-pointer profile"
              onClick={toggleProfileMenu}
            />
            {isProfileMenuOpen && (
              <ul className="z-10 absolute rounded-lg w-32 top-full right-0 mt-2 dark:bg-tertiaryDark shadow-md bg-tertiaryLight">
                <li className="cursor-pointer"><a href="/profile/login" className="block px-4 py-2 hover:bg-secondaryLight dark:hover:bg-complementDark rounded-lg">Profile</a></li>
                {
                  isAuthenticated ?
                    <li>
                      <a
                        className="block px-4 py-2 hover:bg-secondaryLight dark:hover:bg-complementDark rounded-lg cursor-pointer"
                        onClick={logoutHandler}
                      >Log Out
                      </a></li>
                    :
                    <li className="cursor-pointer"><a
                      className="block px-4 py-2 hover:bg-secondaryLight dark:hover:bg-complementDark rounded-lg"
                      onClick={loginHandler}
                    >
                      Login
                    </a>
                    </li>
                }
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default TopBar;