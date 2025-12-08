import { act, renderHook } from '@testing-library/react';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { ProductInterface } from '@/types';

describe('useRecentlyViewed', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns an empty array when no items exist', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    expect(result.current.getItems()).toEqual([]);
  });

  it('adds an item correctly', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    const product = { id: 1, title: 'Product 1', price: 10, thumbnail: 'img1.jpg' };

    result.current.addItem(product);

    expect(result.current.getItems()).toEqual([product]);
  });

  it('removes duplicates and respects limit', () => {
    const { result } = renderHook(() => useRecentlyViewed(2));

    const product1 = {
      id: 1,
      title: 'Product 1',
      price: 10,
      thumbnail: 'img1.jpg',
    } as ProductInterface;
    const product2 = {
      id: 2,
      title: 'Product 2',
      price: 20,
      thumbnail: 'img2.jpg',
    } as ProductInterface;
    const product3 = {
      id: 3,
      title: 'Product 3',
      price: 30,
      thumbnail: 'img3.jpg',
    } as ProductInterface;

    act(() => {
      result.current.addItem(product1);
      result.current.addItem(product2);
      result.current.addItem(product3); // newest
    });

    const items = result.current.getItems();
    expect(items).toHaveLength(2); // limit = 2
    expect(items[0]).toEqual(product3); // newest first
    expect(items[1]).toEqual(product2); // next newest
  });

  it('clears items correctly', () => {
    const { result } = renderHook(() => useRecentlyViewed());
    const product = { id: 1, title: 'Product 1', price: 10, thumbnail: 'img1.jpg' };
    result.current.addItem(product);

    result.current.clear();
    expect(result.current.getItems()).toEqual([]);
  });
});
