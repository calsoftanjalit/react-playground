import type { ActionIconProps } from '@mantine/core';
import { ProductInterface } from './product';

export interface WishlistItem extends ProductInterface {
  addedAt: number;
}

export interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: ProductInterface) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export interface WishlistProviderProps {
  children: React.ReactNode;
}

export interface WishlistButtonProps extends ActionIconProps {
  product: ProductInterface;
  iconSize?: number;
}
