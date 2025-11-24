export interface ProductInfoPanelProps {
  product: {
    id:number
    brand: string;
    sku: string;
    weight: number;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    warrantyInformation: string;
    rating: number;
    discountPercentage: number;
    category: string;
  };
}
