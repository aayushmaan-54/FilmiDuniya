import React, {
  useEffect,
  useState,
  useCallback,
  useRef
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
  useLocation,
  useNavigate
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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.user);

  const profileMenuRef = useRef<HTMLDivElement>(null);

  const RequestToken = localStorage.getItem("RequestToken_TMDB");

  const debouncedSearchInput = useDebounce(searchInputVal, 500);

  const isRootUrl = location.pathname === '/' ||
    location.pathname === '/approved';

  useEffect(() => {
    if (debouncedSearchInput && isRootUrl) {
      dispatch(searchMovie(debouncedSearchInput));
    }
  }, [debouncedSearchInput, dispatch, isRootUrl]);

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
    if (isRootUrl && searchInputVal.length === 0) {
      dispatch(searchMovie(""));
    }
  }, [searchInputVal, dispatch, isRootUrl]);


  const themeHandler = useCallback(() => {
    setIsDark(prevIsDark => !prevIsDark);
  }, [setIsDark]);


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


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(prevIsOpen => !prevIsOpen);
  }, []);


  const handleProfileClick = useCallback(() => {
    setIsProfileMenuOpen(false);
    navigate('/profile/login');
  }, [navigate]);


  return (
    <>
      {isProfileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-md" />
      )}

      <header className="fixed top-0 right-0 left-0 z-50">
        <nav className="dark:bg-secondaryDark bg-contrastLight py-3 px-4 flex flex-wrap justify-between items-center nav-container">
          <div className="flex items-center">
            <button onClick={toggleSidebar} className="mr-4 menu">
              <Hamburger className="text-white" />
            </button>
            <h1 className="text-xl font-bold dark:text-contrastDark heading-logo text-white"><Link to={'/'} onClick={handleLogoClick}>Filmi Duniya</Link></h1>
          </div>

          <div className="flex items-center space-x-4 right-nav">
            {isRootUrl && (
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
            )}

            <button onClick={themeHandler}>
              {isDark ? <Sun className="dark:text-contrastDark size-10 theme-icon" /> : <MoonStars className="text-white dark:text-darkText size-8 theme-icon" />}
            </button>

            <div className="relative" ref={profileMenuRef}>
              <img
                src={
                  user?.avatar?.tmdb?.avatar_path
                    ? `https://image.tmdb.org/t/p/${user?.avatar?.tmdb?.avatar_path}`
                    : user?.avatar?.gravatar?.hash
                      ? `https://www.gravatar.com/avatar/${user?.avatar?.gravatar.hash}`
                      : `${defaultProfile}`
                }
                alt="profile"
                className="size-10 rounded-full cursor-pointer profile"
                onClick={toggleProfileMenu}
              />
              {isProfileMenuOpen && (
                <ul className="z-10 absolute rounded-lg w-32 top-full right-0 mt-2 dark:bg-tertiaryDark shadow-md bg-tertiaryLight">
                  <li className="cursor-pointer">
                    <button onClick={handleProfileClick} className="block w-full text-left px-4 py-2 hover:bg-secondaryLight dark:hover:bg-complementDark rounded-lg">
                      Profile
                    </button>
                  </li>
                  {isAuthenticated ? (
                    <li>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-secondaryLight dark:hover:bg-complementDark rounded-lg cursor-pointer"
                        onClick={logoutHandler}
                      >
                        Log Out
                      </button>
                    </li>
                  ) : (
                    <li className="cursor-pointer">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-secondaryLight dark:hover:bg-complementDark rounded-lg"
                        onClick={loginHandler}
                      >
                        Login
                      </button>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default TopBar;