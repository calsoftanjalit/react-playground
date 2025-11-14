import { AddCartBodyInterface, CartInterface } from '@/types/cart';
import apiClient from '@/services/apis/apiClient';

const ADD_CART = 'carts/add';

export const addCart = async (body: AddCartBodyInterface): Promise<CartInterface> => {
  const { data } = await apiClient.post(ADD_CART, body);
  return data;
};
