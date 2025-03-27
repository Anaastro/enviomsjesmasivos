import { useListInstances } from "@/lib/hooks/useListInstances";
import DotLoader from "../DotLoader";

export default function ListPhoneNumbers() {
  const { loading, instanceNumbers, setInstanceId } = useListInstances();

  const handleSetInstance = (instanceId: string) => {
    setInstanceId(instanceId);
  };

  return (
    <div className="text-white font-extralight border p-6 rounded-lg flex flex-col gap-4 bg-[#071830] w-11/12 md:w-1/3 z-40 shadow-2xl shadow-[#9CFFCB] mb-20">
      <p className="text-xl font-extralight text-center">Instancias</p>

      <p>Seleccione tu instancia para continuar: </p>

      {loading && (
        <div className="flex justify-center items-center px-10 py-20 z-30">
          <DotLoader />
        </div>
      )}

      {instanceNumbers.map(({ instanceId, phoneNumber, message, name }) => (
        <button
          onClick={() => handleSetInstance(instanceId)}
          className="border w-full rounded-lg p-2 hover:bg-[#34006A] transition-all duration-200 font-extralight text-[#9CFFCB]"
          key={instanceId}
        >
          <p>Instancia: {instanceId}</p>
          <p>Telefono: {phoneNumber ? phoneNumber : "Sin número"}</p>
          {name && <p>Nombre: {name}</p>}
          {message && <p>Mensaje: {message}</p>}
        </button>
      ))}
    </div>
  );
}
