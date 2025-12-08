export const CART_STORAGE_KEY = "cart_items";

/**
 * Get user-specific cart storage key
 * @param userId - User ID
 * @returns Storage key for user's cart
 */
export const getUserCartKey = (userId: number): string => {
  return `cart_items_user_${userId}`;
};

/**
 * Get user-specific wishlist storage key
 * @param userId - User ID
 * @returns Storage key for user's wishlist
 */
export const getUserWishlistKey = (userId: number): string => {
  return `wishlist_items_user_${userId}`;
};