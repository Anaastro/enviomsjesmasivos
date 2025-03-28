import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import {
	Instance,
	InstanceAllInformation,
	InstancesResponse,
} from "@/lib/interfaces/instances-responce.interface";
import { generateCode } from "@/services/codeService";
import InstancesService from "@/services/instances-service";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DashboardPage = () => {
	const [instances, setInstances] = useState<InstanceAllInformation[]>([]);
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		phone: "",
	});
	const [pairingCode, setPairingCode] = useState("");

	const [selectedInstance, setSelectedInstance] =
		useState<InstanceAllInformation | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			try {
				const instances = await InstancesService.getAllInstances();
				setInstances(instances);

				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const handleCreateInstance = async () => {
		try {
			Swal.fire({
				title: "Creando instancia",
				text: "Por favor espere",
				allowOutsideClick: false,
				showConfirmButton: false,
				willOpen: async () => {
					Swal.showLoading();
					await new Promise((resolve) => setTimeout(resolve, 2000));
					const { instance } = await InstancesService.createInstance();
					const instanceInformation =
						await InstancesService.getInformationInstance(instance.id);
					setInstances([
						...instances,
						{
							...instance,
							...instanceInformation,
						},
					]);
					setLoading(false);
					Swal.close();
				},
			}).then(() => {
				Swal.fire({
					title: "Instancia creada",
					icon: "success",
				});
				setLoading(true);
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Error al crear la instancia",
				text: "Por favor intente de nuevo",
				icon: "error",
			});
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!selectedInstance) {
			Swal.fire({
				title: "Seleccione una instancia",
				icon: "warning",
			});
			return;
		}

		try {
			Swal.fire({
				title: "Enviando código",
				text: "Por favor espere",
				allowOutsideClick: false,
				showConfirmButton: false,
				willOpen: async () => {
					Swal.showLoading();
					await new Promise((resolve) => setTimeout(resolve, 2000));

					const { pairingCode } = await InstancesService.requestPairingCode(
						selectedInstance.id,
						form.phone
					);
					setPairingCode(pairingCode);
					Swal.close();
				},
			}).then(() => {
				Swal.fire({
					title: "Código enviado",
					icon: "success",
				});
			});
		} catch (error) {
			console.log(error);
			Swal.fire({
				title: "Error al enviar el código",
				text: "Por favor intente de nuevo",
				icon: "error",
			});
		}
	};

	useEffect(() => {
		if (pairingCode) {
			const interval = setTimeout(async () => {
				setPairingCode("");

				if (!selectedInstance) return;

				try {
					const { instanceStatus } =
						await InstancesService.getInformationInstance(selectedInstance.id);

					const updatedInstances = instances.map((instance) => {
						if (instance.id === selectedInstance.id) {
							return {
								...instance,
								instanceStatus,
							};
						}
						return instance;
					});

					setInstances(updatedInstances);
					setSelectedInstance((prev) => {
						if (prev) {
							return {
								...prev,
								instanceStatus,
							};
						}
						return null;
					});
				} catch (error) {
					console.error("Error al obtener datos de la instancia:", error);
				}
			}, 120000);

			return () => clearTimeout(interval);
		}
	}, [pairingCode]);

	return (
		<DashboardLayout>
			<div className="flex flex-col w-full">
				<div className="flex justify-between items-center my-2">
					<h1 className="text-2xl font-bold">Instancias</h1>
				</div>

				<div className="flex justify-start my-5">
					<button
						onClick={handleCreateInstance}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Crear instancia
					</button>
				</div>

				<div className="grid md:grid-cols-2 gap-4">
					<div className="dark">
						{loading && (
							<div className="flex justify-center items-center">
								<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
							</div>
						)}

						{instances.length === 0 && !loading && (
							<div className="flex justify-center items-center">
								<p className="text-gray-500">No hay instancias creadas</p>
							</div>
						)}

						{instances.length > 0 &&
							instances.map((instance) => (
								<div
									key={instance.id}
									className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-2"
								>
									<button onClick={() => setSelectedInstance(instance)}>
										{instance.name}
									</button>
								</div>
							))}
					</div>

					<div className="bg-gray-800 rounded-lg flex justify-center items-center w-full p-2">
						{!selectedInstance && (
							<div className="flex justify-center items-center">
								<p className="text-gray-500">Seleccione una instancia</p>
							</div>
						)}

						{selectedInstance && (
							<div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-2 flex-col w-full">
								<p className="text-lg font-bold">{selectedInstance.name}</p>

								<p>Estado: {selectedInstance.instanceStatus}</p>

								{selectedInstance.instanceStatus === "qr" && !pairingCode && (
									<form
										onSubmit={handleSubmit}
										className="flex flex-col items-center w-2/3 mt-4"
									>
										<label
											htmlFor="phone"
											className="text-white text-left self-start my-2"
										>
											Ingresa tu número de teléfono con código de país
										</label>
										<input
											type="tel"
											value={form.phone}
											onChange={(e) =>
												setForm({ ...form, phone: e.target.value })
											}
											className="bg-gray-700 text-white p-2 rounded-lg w-full"
										/>

										<button
											type="submit"
											className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
										>
											Solicitar Codigo
										</button>
									</form>
								)}

								{pairingCode && (
									<div className="flex items-center flex-col bg-gray-600 p-4 rounded-lg mt-4 shadow-lg">
										<p>Código de emparejamiento:</p>
										<p>{pairingCode}</p>

										<p>
											El codigo de emparejamiento tiene una validez de dos
											minutos.
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default DashboardPage;
