export const ROUTE_PATHS = {
  ROOT: '/',
  HOME: '/',
  ABOUT: '/about',
  CART: '/cart',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
} as const;

export type RoutePathKey = keyof typeof ROUTE_PATHS;
