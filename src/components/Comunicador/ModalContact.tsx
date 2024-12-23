import "react-phone-number-input/style.css";
import PhoneInput, {
  isValidPhoneNumber,
  type Value,
} from "react-phone-number-input";
import { contactService } from "@/services/contactService";
import React, { useState } from "react";
import { Phone } from "@/lib/interfaces/phone";

interface ModalContactProps {
  setPhones: (value: Phone[] | ((prevPhones: Phone[]) => Phone[])) => void;
  setShowModal: (value: boolean) => void;
}

const ModalContact: React.FC<ModalContactProps> = ({
  setPhones,
  setShowModal,
}) => {
  const [valuePhone, setValuePhone] = useState<Value>();
  const [name, setName] = useState<string>("");

  const handleSubmitFormPhone = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!valuePhone) return;
    if (!isValidPhoneNumber(valuePhone)) return;

    const newPhone = {
      id: crypto.randomUUID(),
      name: name,
      phone: valuePhone as string,
      mensajeEnviado: false,
    };

    contactService.addContact(newPhone);
    setShowModal(false);
    setValuePhone(undefined);

    setPhones((prevPhones: Phone[]) => [newPhone, ...prevPhones]);
  };

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-green p-8 rounded-lg bg-white">
        <h3 className="text-xl mb-5">Agregar Numero</h3>
        <form className="block" onSubmit={handleSubmitFormPhone}>
          <input
            type="text"
            name="nombre"
            placeholder="Ingrese nombre"
            id="nombre"
            className="w-full px-2 mb-2"
            value={name}
            onChange={handleChangeName}
          />

          <PhoneInput
            defaultCountry="BO"
            placeholder="Ingrese numero de telefono"
            value={valuePhone}
            className="w-full [&>input]:px-2 mb-2"
            onChange={setValuePhone}
          />

          <div className="grid grid-cols-2 mt-6 gap-2">
            <button
              type="submit"
              className={`p-2 rounded block bg-green-500 text-white ${
                (!valuePhone || !isValidPhoneNumber(valuePhone)) && name === ""
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                (!valuePhone || !isValidPhoneNumber(valuePhone)) && name === ""
              }
            >
              Agregar Numero
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="p-2 rounded bg-red-500 text-white"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalContact;
