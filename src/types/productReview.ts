 interface ProductFeedback {
   rating: number;
   comment: string;
   date: string;
   reviewerName: string;
   reviewerEmail: string;
 }


export interface Product {
  reviews: ProductFeedback[];
}