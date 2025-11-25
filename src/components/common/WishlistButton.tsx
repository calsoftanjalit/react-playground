import { useWishlistStore } from '@/hooks/useWishlistStore';
import type { WishlistButtonProps } from '@/types/wishlist';
import { ActionIcon, useMantineTheme } from '@mantine/core';
import { IconHeart } from '@tabler/icons-react';
import { type FC } from 'react';

export const WishlistButton: FC<WishlistButtonProps> = ({
  product,
  iconSize = 24,
  style,
  ...props
}) => {
  const theme = useMantineTheme();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const toggleWishlist = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <ActionIcon
      variant="default"
      style={style}
      onMouseDown={(event) => event.preventDefault()}
      onClick={toggleWishlist}
      {...props}
    >
      <IconHeart
        size={iconSize}
        color={isWishlisted ? theme.colors.red[6] : theme.colors.gray[6]}
        fill={isWishlisted ? theme.colors.red[6] : 'none'}
      />
    </ActionIcon>
  );
};
