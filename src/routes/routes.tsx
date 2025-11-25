import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ROUTE_PATHS } from './paths';

const HomePage = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductPage"));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CartPage = lazy(() => import('@/pages/Cart'));
const ProductDetailPage = lazy(()=>import("@/components/home/ProductDetails"))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));

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
        {
        path: ROUTE_PATHS.PRODUCTS,
        element: <ProductsPage />,
      },
      {
        path: ROUTE_PATHS.CART,
        element: <CartPage />,
      },
      {
        path: ROUTE_PATHS.CHECKOUT,
        element: <CheckoutPage />,
      },
      {
        path: ROUTE_PATHS.PRODUCT_DETAILS,
        element: <ProductDetailPage />,
      },
      {
        path: ROUTE_PATHS.CART_CHECKOUT,
        element: <CheckoutPage />,
      },
      {
        path: ROUTE_PATHS.PRODUCT_CHECKOUT,
        element: <CheckoutPage />,
      },
      {
        path: ROUTE_PATHS.WISHLIST,
        element: <WishlistPage />,
      },
    ],
  },
];
