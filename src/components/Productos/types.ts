export type Product = {
  id: string;
  name: string;
  images: string[];
  description: string;
  category: string;
  src: string;
  options?: {
    sizes?: string[];
    colors?: string[];
  };
};

export type Category = {
  id: string;
  name: string;
};
