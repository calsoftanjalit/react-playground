import { RouteObject } from "react-router-dom";
import { Layout } from "../components/layout";
import { AboutPage, HomePage } from "../pages";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
    ],
  },
];
