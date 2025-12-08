export const ROUTE_PATHS = {
  ROOT: "/",
  HOME: "/",
  ABOUT: "/about",
  PRODUCTS: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PRODUCT_DETAILS: '/products/:id',
  CART_CHECKOUT: '/cart/checkout',
  PRODUCT_CHECKOUT: '/products/:id/checkout',
  WISHLIST: '/wishlist',
  LOGIN: '/login',
  PROFILE: '/profile',
  ORDERS: '/orders',
} as const;

export type RoutePathKey = keyof typeof ROUTE_PATHS;
