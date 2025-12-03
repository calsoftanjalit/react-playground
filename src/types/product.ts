export interface ProductInterface {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export interface ProductApiInterface {
  products: ProductInterface[];
  total?: number;
}

export type ThumbnailListProps = {
  images: string[];
  mainImage: string;
  onSelect: (img: string) => void;
}

export type MainImageProps = {
  src: string;
  width?: number;
  height?: number;
  zoomFactor?: number;
  paneRef: React.RefObject<HTMLDivElement>;
};

export type ProductGalleryProps = {
  images: string[];
};
