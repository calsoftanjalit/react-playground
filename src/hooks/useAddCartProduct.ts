import { CART_USER } from '@/constants/api';
import { addCart } from '@/services/cartService';
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

export const useAddCartProduct = () => {
  const mutation = useMutation({
    mutationFn: addCart,
    onSuccess: (data) => {
      notifications.show({
        title: 'Success!',
        message: 'Item added to cart.',
        color: 'green',
      });
      console.log('>>>>>>>>>>>>>>>>>>>>', data);
    },
    onError: (error) => {
      console.error('Mutation failed:', error);
      notifications.show({
        title: 'Error!',
        message: 'The item could not be added to your cart.',
        color: 'red',
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

  return { handleAddCartProduct, mutation };
};
