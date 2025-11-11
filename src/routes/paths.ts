export const ROUTE_PATHS = {
  ROOT: "/",
  HOME: "/",
  ABOUT: "/about",
} as const;

export type RoutePathKey = keyof typeof ROUTE_PATHS;
