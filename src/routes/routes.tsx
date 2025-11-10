import { RouteObject } from "react-router-dom";
import { Layout } from "../components/layout";
import { AboutPage, HomePage } from "../pages";
import { ROUTE_PATHS } from "./paths";

export const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.ROOT,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ROUTE_PATHS.ABOUT,
        element: <AboutPage />,
      },
    ],
  },
];
