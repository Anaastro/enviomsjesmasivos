import React, { useState } from "react";

type Product = {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
  options?: {
    sizes?: string[];
    colors?: string[];
  };
};

type ProductCardProps = {
  product: Product;
  onSelectProduct: (product: Product) => void;
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const shortDescription = product.description.substring(0, 100); // Muestra los primeros 100 caracteres

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 p-4">
      <div className="bg-black border-2 border-orange-500 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover rounded-lg" // Aumentar el tamaño de la imagen
        />
        <div className="p-4 text-orange-200">
          <h3 className="text-lg font-bold mb-2 text-orange-500">
            {product.name}
          </h3>
          <p className="text-sm mb-4">
            {isExpanded ? product.description : `${shortDescription}... `}
            <span
              className="text-orange-500 cursor-pointer hover:text-orange-700"
              onClick={toggleDescription}
            >
              {isExpanded ? "Mostrar menos" : "Continuar leyendo"}
            </span>
          </p>
          <button
            className="bg-orange-500 text-black px-4 py-2 rounded-md hover:bg-orange-600"
            onClick={() => onSelectProduct(product)}
          >
            Saber Más
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
