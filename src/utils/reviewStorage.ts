import { getFromStorage, setInStorage } from '@/utils/storage';
import { LocalProductFeedback } from '@/types/productReview';
import { STORAGE_KEY } from '@/constants/index';

export function getLocalReviews(productId: number) {
  const allReviews = getFromStorage<Record<string, LocalProductFeedback[]>>(STORAGE_KEY) || {};
  return allReviews[productId] || [];
}

export function saveLocalReview(productId: number, review: LocalProductFeedback) {
  const allReviews = getFromStorage<Record<string, LocalProductFeedback[]>>(STORAGE_KEY) || {};

  if (!allReviews[productId]) {
    allReviews[productId] = [];
  }

  allReviews[productId].push(review);

  setInStorage(STORAGE_KEY, allReviews);
}
