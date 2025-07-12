export {};

declare global {
  interface Window {
    api: {
      getProducts: () => any[];
      addProduct: (product: any) => void;
      deleteProduct: (id: string) => void;
      reduceStock: (id: string, quantity: number) => void;
    };
  }
}
