import { Outlet } from "react-router-dom";

import { NavBar } from "../exports";

import "./Layout.css";

import {
  useEffect,
  useState
} from "react";


const Layout = () => {

  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem('website-theme');
    if (storedPreference) {
      setIsDark(storedPreference === 'dark');
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
      localStorage.setItem('website-theme', systemPrefersDark ? 'dark' : 'light');
    }
  }, []);


  useEffect(() => {
    if (isDark !== null) {
      localStorage.setItem('website-theme', isDark ? 'dark' : 'light');
    }
  });


  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);


  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };


  return (
    <div className={`w-full min-h-screen flex flex-col dark:text-darkText text-lightText ${isDark ? 'dark:bg-darkBg' : 'bg-lightBg'} ${isDark ? 'dark' : ''} overflow-x-hidden`}>
      <NavBar
        isDark={isDark}
        setIsDark={setIsDark}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;