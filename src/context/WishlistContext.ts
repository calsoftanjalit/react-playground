import { createContext } from 'react';
import { WishlistContextType } from '@/types/wishlist';

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);
