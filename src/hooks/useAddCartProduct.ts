import { CART_USER } from '@/constants/api';
import { addCart } from '@/services/cartService';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from './useCartStore';
import { showToast } from '@/utils';

export const useAddCartProduct = (id: number) => {
  const { items, addItem, updateItem } = useCartStore();

  const cartItem = items.find((item) => item.id === id);
  const quantity = cartItem?.quantity ?? 0;

  const mutation = useMutation({
    mutationFn: addCart,
    onSuccess: (data) => {
      const product = data?.products[0];
      showToast({
        type: 'success',
        title: 'Added to cart',
        message: `${product.title} has been added to your cart`,
        autoClose: 3000,
      });
      if (product) addItem(product);
    },

    onError: (error) => {
      console.error('Mutation failed:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'The item could not be added to your cart.',
        autoClose: 3000,
      });
    },
  });

  const handleAddCartProduct = (productId: number) => {
    mutation.mutate({
      userId: CART_USER,
      products: [
        {
          id: productId,
          quantity: 1,
        },
      ],
    });
  };

  return { handleAddCartProduct, mutation, quantity, cartItem, updateItem };
};
