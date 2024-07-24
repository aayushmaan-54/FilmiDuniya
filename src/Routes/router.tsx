import { createBrowserRouter } from "react-router-dom";

import {
  Actor,
  Home,
  Layout,
  MovieInformation,
  Profile,
} from "../Global/exports";

import "../Global/global.css";


const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/movie/:movieID", element: <MovieInformation /> },
      { path: "/Actor/:actorID", element: <Actor /> },
      { path: "/profile/:profileID", element: <Profile /> },
      { path: "/approved", element: <Home /> }
    ],
  },
]);

export default router;