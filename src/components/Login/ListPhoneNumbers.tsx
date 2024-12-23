import { useListInstances } from "@/lib/hooks/useListInstances";
import DotLoader from "../DotLoader";

export default function ListPhoneNumbers() {
	const { loading, instanceNumbers, setInstanceId } = useListInstances();

	const handleSetInstance = (instanceId: string) => {
		setInstanceId(instanceId);
	};

	return (
		<div className="text-black border p-6 rounded-lg flex flex-col gap-4 bg-white w-11/12 md:w-1/3">
			<p className="text-lg font-bold">Instancias</p>

			<p>Seleccione una instancia para continuar: </p>

			{loading && (
				<div className="flex justify-center items-center px-10 py-20">
					<DotLoader />
				</div>
			)}

			{instanceNumbers.map(({ instanceId, phoneNumber, message, name }) => (
				<button
					onClick={() => handleSetInstance(instanceId)}
					className="border w-full rounded-lg p-2 hover:bg-gray-200 transition-all duration-200"
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
