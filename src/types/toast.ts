export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ShowToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
  autoClose?: number | boolean;
}
