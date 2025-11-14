import {
  AddCartBodyInterface,
  CartApiInterface,
  CartInterface,
  UpdateCartBodyInterface,
} from '@/types/cart';
import apiClient from '@/services/apis/apiClient';
import { CART_USER } from '@/constants/api';

const CART_URL = `carts/user/${CART_USER}`;
const ADD_CART = 'carts/add';

export const fetchCart = async (): Promise<CartApiInterface> => {
  const { data } = await apiClient.get(`${CART_URL}`);
  return data;
};

let abortController: AbortController | null = null;
export const addCart = async (body: AddCartBodyInterface): Promise<CartInterface> => {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  try {
    const { data } = await apiClient.post(ADD_CART, body, {
      signal: abortController.signal,
    });
    return data;
  } finally {
    abortController = null;
  }
};

export const updateItem = async (
  id: number,
  body: UpdateCartBodyInterface
): Promise<CartInterface> => {
  const { data } = await apiClient.put(`carts/${id}`, body);
  return data;
};
