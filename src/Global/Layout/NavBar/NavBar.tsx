import {
  SideBar,
  TopBar
} from "../../exports";

type NavBarProps = {
  isDark: boolean | null;
  setIsDark: React.Dispatch<React.SetStateAction<boolean | null>>;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const NavBar = ({ isDark, setIsDark, toggleSidebar, isSidebarOpen, setIsSidebarOpen }: NavBarProps) => {
  return (
    <aside className="w-full">
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} setIsSidebarOpen={setIsSidebarOpen} />
      <TopBar isDark={isDark} setIsDark={setIsDark} toggleSidebar={toggleSidebar} setIsSidebarOpen={setIsSidebarOpen} />
    </aside>
  )
}

export default NavBar