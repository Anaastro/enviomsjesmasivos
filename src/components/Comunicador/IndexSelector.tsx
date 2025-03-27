import { Phone } from "@/lib/interfaces/phone";
import {
  FaArrowAltCircleLeft,
  FaArrowAltCircleRight,
  FaCheckCircle,
} from "react-icons/fa";

interface Props {
  phones: Phone[];
  startIndex: number;
  handleStartIndexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  endIndex: number;
  handleEndIndexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectRange: () => void;
}

export const IndexSelector = ({
  phones,
  startIndex,
  handleStartIndexChange,
  endIndex,
  handleEndIndexChange,
  handleSelectRange,
}: Props) => {
  return (
    <div className="mb-6">
      <label className="block text-white font-extralight mb-2 text-center">
        Seleccionar rango y haz clic
      </label>
      <div className="flex space-x-4 justify-center items-center">
        <div className="relative">
          <input
            type="number"
            min="1"
            max={phones.length}
            value={startIndex}
            onChange={handleStartIndexChange}
            className="p-4 pl-10 pr-4 text-2xl text-center border-2 border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
            placeholder="Desde"
          />
          <FaArrowAltCircleLeft className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-3xl" />
        </div>

        <div className="relative">
          <input
            type="number"
            min="1"
            max={phones.length}
            value={endIndex}
            onChange={handleEndIndexChange}
            className="p-4 pl-10 pr-4 text-2xl text-center border-2 border-gray-300 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
            placeholder="Hasta"
          />
          <FaArrowAltCircleRight className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 text-3xl" />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSelectRange}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <FaCheckCircle className="text-4xl" />
        </button>
      </div>
    </div>
  );
};
