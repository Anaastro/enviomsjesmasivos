import Loader from "../Loader";
import { usePhoneList } from "@/lib/hooks/usePhoneList";
import { useContext, useEffect, useState } from "react";
import { SelectedPhonesContext } from "@/lib/context/SelectedPhonesContext";
import { FaList } from "react-icons/fa";
interface PhonesListProps {
  phones: Phone[];
  selectedPhones: string[];
  onPhoneSelect: (phone: string) => void;
  colorMap: { [key: string]: string };
}

interface Phone {
  id: string;
  name: string;
  phone: string;
  mensajeEnviado: boolean;
}

const PhonesList: React.FC<PhonesListProps> = ({
  phones,
  selectedPhones,
  onPhoneSelect,
  colorMap,
}) => {
  const {
    loading,
    handleSubmit,
    formLocation,
    setFormLocation,
    filteredPhones,
    searchTerm,
    setSearchTerm,
  } = usePhoneList({ phones });

  const { lastSelectedPhone, setLastSelectedPhone } = useContext(
    SelectedPhonesContext
  );

  const [selectedIndexs, setSelectedIndexs] = useState<number[]>([]);

  useEffect(() => {
    if (selectedIndexs.length === 0) {
      setLastSelectedPhone((prev) => ({
        ...prev,
        index: -1,
      }));
    } else {
      const maxIndex = Math.max(...selectedIndexs);
      setLastSelectedPhone((prev) => ({
        ...prev,
        index: maxIndex,
      }));
    }
  }, [selectedIndexs, setLastSelectedPhone]);

  const handleLastSelectedPhone = (index: number) => {
    setSelectedIndexs((prev) => {
      const updatedIndexes = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];

      return updatedIndexes;
    });
  };

  return (
    <div className="border-5 border-purple-700 p-6 bg-transparent shadow-xl rounded-2xl z-30">
      {loading && <Loader content="Obteniendo contactos" />}

      <h3 className="text-xl font-extralight text-[#efefef] mb-4  text-center z-50 flex items-center justify-center">
        <FaList className="mr-2" /> Listado de contactos subidos
      </h3>

      <p className="text-xl font-extralight text-[#efefef]">
        Ultimo mensaje enviado:{" "}
        {lastSelectedPhone.sent === -1
          ? `${0}`
          : `${lastSelectedPhone.sent + 1}`}
      </p>

      <input
        type="text"
        placeholder="Buscar por número..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <ul className="list-disc max-h-60 overflow-y-auto space-y-2">
        {filteredPhones.map(
          ({ id, name, phone, mensajeEnviado }: Phone, index: number) => (
            <li
              key={id}
              className={`p-2 rounded ${
                selectedPhones.includes(id)
                  ? "bg-blue-500 text-white"
                  : colorMap[phone] || "bg-[#9CFFCB]"
              }`}
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedPhones.includes(id)}
                  onChange={() => {
                    onPhoneSelect(id);
                    handleLastSelectedPhone(index);
                  }}
                  className="mr-2 focus:ring-2 focus:ring-blue-400"
                />
                {index + 1}.{" "}
                <div className="flex flex-col px-2">
                  <p>{name}</p>
                  <p>{phone}</p>
                </div>
                {mensajeEnviado && (
                  <span className="ml-2 text-green-600">Mensaje enviado</span>
                )}
              </label>
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export default PhonesList;
