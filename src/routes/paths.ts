export const ROUTE_PATHS = {
  ROOT: "/",
  HOME: "/",
  ABOUT: "/about",
  PRODUCTS: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
} as const;

export type RoutePathKey = keyof typeof ROUTE_PATHS;
