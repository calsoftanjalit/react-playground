import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { Layout } from '../components/layout';
import { ROUTE_PATHS } from './paths';
import { RouteErrorFallback } from '@/components/miscellaneous';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const HomePage = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductPage"));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const CartPage = lazy(() => import('@/pages/Cart'));
const ProductDetailPage = lazy(()=>import("@/components/home/ProductDetails"))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const WishlistPage = lazy(() => import('@/pages/WishlistPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const OrdersPage = lazy(() => import('@/pages/OrdersPage').then(m => ({ default: m.OrdersPage })));

export const routes: RouteObject[] = [
  {
    path: ROUTE_PATHS.ROOT,
    element: <Layout />,
    errorElement: <RouteErrorFallback />,
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
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATHS.PRODUCT_DETAILS,
        element: <ProductDetailPage />,
      },
      {
        path: ROUTE_PATHS.CART_CHECKOUT,
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATHS.PRODUCT_CHECKOUT,
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATHS.WISHLIST,
        element: <WishlistPage />,
      },
      {
        path: ROUTE_PATHS.LOGIN,
        element: <LoginPage />,
      },
      {
        path: ROUTE_PATHS.PROFILE,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTE_PATHS.ORDERS,
        element: (
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
];


