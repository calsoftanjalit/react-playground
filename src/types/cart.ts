export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  thumbnail: string;
}

export interface CartInterface {
  id: number;
  products: CartItem[];
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
  product: CartItem;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateItem: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  isLoading: boolean;
}

export interface CartProviderProps {
  children: React.ReactNode;
}
