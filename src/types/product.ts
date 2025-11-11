export interface ProductInterface {
  id: number;
  title: string;
  price: number;
}

export interface ProductApiInterface {
  products: ProductInterface[];
}
