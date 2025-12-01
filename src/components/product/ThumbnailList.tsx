import { ThumbnailListProps } from "@/types";
import { Image, Paper, Stack } from "@mantine/core";
import styles from "@/styles/ProductGallery.module.scss"

export const ThumbnailList: React.FC<ThumbnailListProps> = ({ images, mainImage, onSelect }) => {
  return (
    <Stack>
      {images.map((img) => (
        <Paper
          key={img}
          withBorder
          className={`${styles.thumbnailPaper} ${mainImage === img ? styles.active : ''}`}
          onClick={() => onSelect(img)}
        >
          <Image src={img} alt="thumb" radius="md" width={70} height={70} fit="cover" />
        </Paper>
      ))}
    </Stack>
  );
};
