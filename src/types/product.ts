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
  category: string | null | undefined;
  searchValue: string;
  setCategory: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
}
