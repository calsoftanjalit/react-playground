interface ProductFeedback {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface LocalProductFeedback {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  date: string; // the current date on the go to make it consistent and for the betterment of UX
}

export interface UserFeedbackProps {
  productId: number;
}

export interface RatingStarProp {
  value: number;
}export interface Product {
  reviews: ProductFeedback[];
}
