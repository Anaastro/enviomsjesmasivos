import { Phone } from "@/lib/interfaces/phone";
import Loader from "../Loader";
import { useUploader } from "@/lib/hooks/useUploader";

interface ExcelUploaderProps {
	setPhones: React.Dispatch<React.SetStateAction<Phone[]>>;
	setLog: React.Dispatch<React.SetStateAction<string[]>>;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({ setPhones, setLog }) => {
	const {
		file,
		uploaded,
		loading,
		errorExcel,
		existingPhones,
		handleExcelUpload,
		generateExcelFile,
		handleFileProcess,
	} = useUploader({
		setPhones,
	});

	return (
		<div className="border-2 border-purple-400 p-4 bg-white shadow rounded">
			{loading && <Loader content="Procesando archivo..." />}

			<h3 className="text-lg font-semibold mb-2">Subir Contactos</h3>
			<input
				type="file"
				onChange={(e) => e.target.files && handleExcelUpload(e.target.files[0])}
				className="w-full p-2 border rounded"
				accept=".xls,.xlsx"
			/>

			{errorExcel && (
				<div className="my-3 text-red-500">
					{errorExcel}. Por favor, descarga la plantilla y sube un archivo con
					el formato correcto.
				</div>
			)}

			{existingPhones && (
				<div className="my-3 text-red-500">
					Los siguientes números ya existen en la base de datos:&nbsp;
					{existingPhones.join(", ")}
				</div>
			)}

			{uploaded && (
				<div className="my-3 text-green-500">
					Archivo procesado exitosamente. Ahora puedes seleccionar los
					contactos.
				</div>
			)}

			<div className="flex justify-around align-middle flex-wrap">
				<button
					className="mt-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded transition"
					onClick={generateExcelFile}
				>
					Descargar Plantilla
				</button>
				{file && (
					<button
						onClick={handleFileProcess}
						className={`mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition ${errorExcel !== null ? "opacity-50 cursor-not-allowed" : ""}`}
						disabled={errorExcel !== null}
					>
						Procesar Archivo
					</button>
				)}
			</div>
		</div>
	);
};

export default ExcelUploader;
