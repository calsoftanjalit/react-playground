export interface ProductInterface {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export interface ProductApiInterface {
  products: ProductInterface[];
}
