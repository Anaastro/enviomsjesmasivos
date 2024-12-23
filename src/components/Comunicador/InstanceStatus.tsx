import { useInstance } from "@/lib/hooks/useInstance";
import { type InstanceStatus } from "@/lib/interfaces";
import Image from "next/image";

export default function InstanceStatus() {
	const { information, setInstanceId, qr, instanceId, fetchStatus } =
		useInstance();

	const handleInstanceUpdate = async () => {
		await fetchStatus();
	};

	return (
		<div className="bg-white text-black w-full p-4 rounded-lg flex flex-col justify-center items-center">
			<p className="text-center text-lg">Estado de la instancia</p>

			<div className="border rounded-lg p-4 mt-2 w-full [&>p]:px-4 [&>p]:py-2 [&>p]:border [&>p]:rounded flex flex-col gap-2">
				<p>Nombre: {information?.data?.displayName || ""}</p>
				<p>Telefono: {information?.data?.formattedNumber || ""}</p>
				<p>Instancia: {information?.instanceId || ""}</p>

				<div className="grid grid-cols-2">
					<Image
						src={"/images/logo-astro-information.png"}
						alt={"Astro Logo"}
						width={300}
						height={300}
						className="w-full"
					/>
					{qr && (
						<img src={qr} alt={`QR Code - ${instanceId}`} className="w-full" />
					)}
				</div>
			</div>

			<button
				onClick={handleInstanceUpdate}
				className="bg-blue-500 rounded-lg px-4 py-2 text-white my-2 text-center hover:bg-blue-600 transition-all ease-in-out"
			>
				Actualizar estado de la instancia
			</button>
		</div>
	);
}
