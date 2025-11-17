import { useEffect } from "react";
import { useLocation, useRoutes } from "react-router-dom";
import { routes } from "./routes";

export function AppRoutes() {
  const element = useRoutes(routes);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return element;
}
