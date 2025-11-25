export interface ProductInterface {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export interface ProductApiInterface {
  products: ProductInterface[];
}

export interface FilterProviderProps {
  children: React.ReactNode;
}

export interface FilterContextType {
  categoryList: string | null | undefined;
  searchValue: string;
  setCategoryList: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}
