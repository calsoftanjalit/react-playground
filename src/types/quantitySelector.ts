export interface QuantitySelectorProps {
  quantity: number;
  handleIncrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleDecrement: (e: React.MouseEvent<HTMLButtonElement>) => void;
}