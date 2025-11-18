export const ROUTE_PATHS = {
  ROOT: "/",
  HOME: "/",
  ABOUT: "/about",
  PRODUCTS: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PRODUCT_DETAILS: '/products/:id',
} as const;

export type RoutePathKey = keyof typeof ROUTE_PATHS;
