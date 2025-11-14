export interface CartProductInterface {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

export interface CartInterface {
  id: number;
  products: CartProductInterface[];
  total: number;
}

export interface CartApiInterface {
  carts: CartInterface;
}

export interface AddProductInterface {
  id: number;
  quantity: number;
}

export interface AddCartBodyInterface {
  userId: number;
  products: AddProductInterface[];
}

export interface UpdateCartBodyInterface {
  merge: boolean;
  products: AddProductInterface[];
}

export interface CartQuantityInterface {
  quantity: number;
  onQuantityChange?: (newQuantity: number) => void;
}

export interface CartTableRowProps {
  product: CartProductInterface;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}
