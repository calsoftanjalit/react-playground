import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ROUTE_PATHS } from './paths';

const HomePage = lazy(() => import('../pages/HomePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const CartPage = lazy(() => import('@/components/Cart/Cart'));

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
        path: ROUTE_PATHS.CART,
        element: <CartPage />,
      },
    ],
  },
];
