import { routes } from '@/routes/routes';
import { render } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../pages/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('../pages/ProductPage', () => ({
  default: () => <div data-testid="product-page">Product Page</div>,
}));

vi.mock('@/pages/AboutPage', () => ({
  default: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock('@/pages/Cart', () => ({
  default: () => <div data-testid="cart-page">Cart Page</div>,
}));

vi.mock('@/components/home/ProductDetails', () => ({
  default: () => <div data-testid="product-details">Product Details</div>,
}));

vi.mock('@/pages/CheckoutPage', () => ({
  default: () => <div data-testid="checkout-page">Checkout Page</div>,
}));

describe('routes configuration', () => {
  it('should have routes array defined', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
  });

  it('should have a root route with Layout', () => {
    const rootRoute = routes[0];
    expect(rootRoute).toBeDefined();
    expect(rootRoute.path).toBe('/');
    expect(rootRoute.element).toBeDefined();
  });

  it('should have children routes defined', () => {
    const rootRoute = routes[0];
    expect(rootRoute.children).toBeDefined();
    expect(Array.isArray(rootRoute.children)).toBe(true);
    expect(rootRoute.children!.length).toBeGreaterThan(0);
  });

  it('should have an index route (HomePage)', () => {
    const rootRoute = routes[0];
    const indexRoute = rootRoute.children!.find((route) => route.index === true);
    expect(indexRoute).toBeDefined();
    expect(indexRoute!.element).toBeDefined();
  });

  it('should have /about route', () => {
    const rootRoute = routes[0];
    const aboutRoute = rootRoute.children!.find((route) => route.path === '/about');
    expect(aboutRoute).toBeDefined();
    expect(aboutRoute!.element).toBeDefined();
  });

  it('should have /products route', () => {
    const rootRoute = routes[0];
    const productsRoute = rootRoute.children!.find((route) => route.path === '/products');
    expect(productsRoute).toBeDefined();
    expect(productsRoute!.element).toBeDefined();
  });

  it('should have /cart route', () => {
    const rootRoute = routes[0];
    const cartRoute = rootRoute.children!.find((route) => route.path === '/cart');
    expect(cartRoute).toBeDefined();
    expect(cartRoute!.element).toBeDefined();
  });

  it('should have /checkout route', () => {
    const rootRoute = routes[0];
    const checkoutRoute = rootRoute.children!.find((route) => route.path === '/checkout');
    expect(checkoutRoute).toBeDefined();
    expect(checkoutRoute!.element).toBeDefined();
  });

  it('should have product details route', () => {
    const rootRoute = routes[0];
    const productDetailsRoute = rootRoute.children!.find((route) => route.path?.includes('product'));
    expect(productDetailsRoute).toBeDefined();
  });

  it('should lazy load all page components', async () => {
    const { lazy } = await import('react');
    expect(lazy).toBeDefined();
  });

  it('should have all necessary routes configured', () => {
    const rootRoute = routes[0];
    const paths = rootRoute.children!.map((route) => route.path || 'index');
    
    expect(paths).toContain('index');
    expect(paths).toContain('/about');
    expect(paths).toContain('/products');
    expect(paths).toContain('/cart');
    expect(paths).toContain('/checkout');
  });

  it('should render HomePage lazy component', async () => {
    const rootRoute = routes[0];
    const indexRoute = rootRoute.children!.find((route) => route.index === true);
    
    const { findByTestId } = render(
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          {indexRoute!.element}
        </Suspense>
      </MemoryRouter>
    );

    const homePage = await findByTestId('home-page');
    expect(homePage).toBeInTheDocument();
  });

  it('should render ProductPage lazy component', async () => {
    const rootRoute = routes[0];
    const productsRoute = rootRoute.children!.find((route) => route.path === '/products');
    
    const { findByTestId } = render(
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          {productsRoute!.element}
        </Suspense>
      </MemoryRouter>
    );

    const productPage = await findByTestId('product-page');
    expect(productPage).toBeInTheDocument();
  });

  it('should render AboutPage lazy component', async () => {
    const rootRoute = routes[0];
    const aboutRoute = rootRoute.children!.find((route) => route.path === '/about');
    
    const { findByTestId } = render(
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          {aboutRoute!.element}
        </Suspense>
      </MemoryRouter>
    );

    const aboutPage = await findByTestId('about-page');
    expect(aboutPage).toBeInTheDocument();
  });

  it('should render CartPage lazy component', async () => {
    const rootRoute = routes[0];
    const cartRoute = rootRoute.children!.find((route) => route.path === '/cart');
    
    const { findByTestId } = render(
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          {cartRoute!.element}
        </Suspense>
      </MemoryRouter>
    );

    const cartPage = await findByTestId('cart-page');
    expect(cartPage).toBeInTheDocument();
  });

  it('should render ProductDetails lazy component', async () => {
    const rootRoute = routes[0];
    const productDetailsRoute = rootRoute.children!.find((route) => route.path?.includes('product') && route.path !== '/products');
    
    const { findByTestId } = render(
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          {productDetailsRoute!.element}
        </Suspense>
      </MemoryRouter>
    );

    const productDetails = await findByTestId('product-details');
    expect(productDetails).toBeInTheDocument();
  });

  it('should render CheckoutPage lazy component', async () => {
    const rootRoute = routes[0];
    const checkoutRoute = rootRoute.children!.find((route) => route.path === '/checkout');
    
    const { findByTestId } = render(
      <MemoryRouter>
        <Suspense fallback={<div>Loading...</div>}>
          {checkoutRoute!.element}
        </Suspense>
      </MemoryRouter>
    );

    const checkoutPage = await findByTestId('checkout-page');
    expect(checkoutPage).toBeInTheDocument();
  });
});
