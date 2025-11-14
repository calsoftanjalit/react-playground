export const ROUTE_PATHS = {
  ROOT: '/',
  HOME: '/',
  ABOUT: '/about',
  CART: '/cart',
} as const;

export type RoutePathKey = keyof typeof ROUTE_PATHS;
