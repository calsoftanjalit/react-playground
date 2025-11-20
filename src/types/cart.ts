export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total?: number;
  thumbnail?: string;
}

export interface CartInterface {
  id: number;
  products: CartItem[];
  total: number;
}

export interface AddProductInterface {
  id: number;
  quantity: number;
}

export interface AddCartBodyInterface {
  userId: number;
  products: AddProductInterface[];
}

export interface CartTableRowProps {
  product: CartItem;
  onQuantityChange: (id: number, newQuantity: number) => void;
  onRemove: (id: number) => void;
  quantity: number;
  totalPrice: number;
}

export interface OrderItemProps {
  item: CartItem;
  showRemove?: boolean;
  onRemove?: (id: number) => void;
  showQuantityControls?: boolean;
  onQuantityChange?: (id: number, newQuantity: number) => void;
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
