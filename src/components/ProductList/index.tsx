import React from "react";
import { Product } from "@/components/Productos/types";

type ProductListProps = {
  products: Product[];
  onSelectProduct: (product: Product) => void;
};

const ProductList: React.FC<ProductListProps> = ({
  products,
  onSelectProduct,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-black border-4 border-orange-500 p-4 rounded-lg shadow-md"
        >
          {product.images &&
            product.images.length > 0 &&
            product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            ))}
          <h3 className="text-xl font-bold text-orange-500 mb-2">
            {product.name}
          </h3>
          <p className="text-orange-200 mb-4">{product.description}</p>
          <button
            className="bg-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
            onClick={() => onSelectProduct(product)}
          >
            Saber más
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
