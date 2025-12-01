import { Box, Flex } from "@mantine/core";
import { useRef, useState } from "react";
import { ProductGalleryProps } from "@/types";
import styles from '@/styles/ProductGallery.module.scss';
import { ThumbnailList, MainImage } from "@/components/product";

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState<string>(images[0]);
  const paneRef = useRef<HTMLDivElement>(null); // external pane

  return (
    <Flex gap="lg" align="flex-start">
      <ThumbnailList images={images} mainImage={mainImage} onSelect={setMainImage} />
      <MainImage src={mainImage} paneRef={paneRef} />
      
      <Box ref={paneRef} className={styles.zoomPane} />
    </Flex>
  );
};
