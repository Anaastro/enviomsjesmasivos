import React, { useState } from "react";
import { Product } from "@/components/Productos/types";

type ProductDetailsProps = {
  product: Product;
  onClose: () => void;
};

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onClose,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [deliveryOption, setDeliveryOption] = useState<string>("Envio");
  const [paymentOption, setPaymentOption] = useState<string>("Contado");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center">
      <div className="bg-black border-4 border-orange-500 p-6 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-3/5 relative">
        <button
          className="absolute top-4 right-4 text-orange-500 hover:text-orange-700 text-3xl"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row items-center">
          {product.images.length > 0 && (
            <img
              src={product.images[0]} // Selecciona la primera imagen del array
              alt={product.name}
              className="w-full md:w-2/3 h-96 object-cover rounded-lg mb-4 md:mb-0 md:mr-6 border-2 border-orange-500"
            />
          )}
          <div className="text-white w-full md:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-orange-500">
              {product.name}
            </h2>
            <p className="text-orange-200 mb-6">{product.description}</p>

            {product.options?.sizes && (
              <div className="mb-6">
                <label className="block mb-2 font-bold text-orange-500">
                  Tamaño:
                </label>
                <select
                  className="border-2 border-orange-500 rounded-md p-2 w-full bg-black text-orange-200"
                  onChange={(e) => setSelectedSize(e.target.value)}
                  value={selectedSize || ""}
                >
                  <option value="" className="bg-black">
                    Seleccione un tamaño
                  </option>
                  {product.options.sizes.map((size) => (
                    <option key={size} value={size} className="bg-black">
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {product.options?.colors && (
              <div className="mb-6">
                <label className="block mb-2 font-bold text-orange-500">
                  Color:
                </label>
                <select
                  className="border-2 border-orange-500 rounded-md p-2 w-full bg-black text-orange-200"
                  onChange={(e) => setSelectedColor(e.target.value)}
                  value={selectedColor || ""}
                >
                  <option value="" className="bg-black">
                    Seleccione un color
                  </option>
                  {product.options.colors.map((color) => (
                    <option key={color} value={color} className="bg-black">
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mb-6">
              <label className="block mb-2 font-bold text-orange-500">
                Cantidad:
              </label>
              <input
                type="number"
                className="border-2 border-orange-500 rounded-md p-2 w-full bg-black text-orange-200"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-orange-500">
                Opción de entrega:
              </label>
              <select
                className="border-2 border-orange-500 rounded-md p-2 w-full bg-black text-orange-200"
                onChange={(e) => setDeliveryOption(e.target.value)}
                value={deliveryOption}
              >
                <option value="Envio" className="bg-black">
                  Envio
                </option>
                <option value="Retira del Local" className="bg-black">
                  Retira del Local
                </option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-bold text-orange-500">
                Opción de pago:
              </label>
              <select
                className="border-2 border-orange-500 rounded-md p-2 w-full bg-black text-orange-200"
                onChange={(e) => setPaymentOption(e.target.value)}
                value={paymentOption}
              >
                <option value="Contado" className="bg-black">
                  Contado
                </option>
                <option value="Transferencia" className="bg-black">
                  Transferencia
                </option>
              </select>
            </div>

            <button className="bg-orange-500 text-black px-6 py-3 rounded-md hover:bg-orange-600 transition-colors duration-300 w-full">
              Comprar Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
