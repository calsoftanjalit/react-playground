import { Box, Image } from '@mantine/core';
import { useEffect, useRef } from 'react';
import Drift from "drift-zoom";
import styles from "@/styles/ProductGallery.module.scss"
import { MainImageProps } from '@/types';

export const MainImage: React.FC<MainImageProps> = ({ src, width = 300, height = 300, paneRef }) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (src && imgRef.current && paneRef.current) {
      const driftInstance = new Drift(imgRef.current, {
        paneContainer: paneRef.current,
        inlinePane: false,
        hoverBoundingBox: true,
        containInline: true,
      });

      return () => driftInstance?.teardown?.()
    }
  }, [src, paneRef]);

  return (
    <Box pos="relative" style={{ width, height }}>
      <Image
        src={src}
        alt="product"
        width={width}
        height={height}
        fit="cover"
        ref={imgRef}
        data-zoom={src}
        className={styles.productImage}
      />
    </Box>
  );
};
