import { Phone } from "@/lib/interfaces/phone";
import Loader from "../Loader";
import { useUploader } from "@/lib/hooks/useUploader";
import { FiUpload, FiDownload } from "react-icons/fi"; // Íconos de react-icons
import { useState } from "react";

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

	const [fileName, setFileName] = useState<string | null>(null); 

	
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFileName(e.target.files[0].name); 
			handleExcelUpload(e.target.files[0]);
		}
	};

	
	const handleFileProcessWithClear = () => {
		handleFileProcess();
		setFileName(null); 
	};

	return (
		<div className="border-5 border-purple-700 p-4 bg-transparent shadow rounded-2xl z">
			{loading && <Loader content="Procesando archivo, un momento por favor" />}

			<h3 className="text-xl mb-4 text-[#efefef] text-center font-extralight">
				Sube aquí tu lista de contactos
			</h3>

			<div className="mb-4">
				<div className="flex items-center gap-2 mb-2">
					<FiUpload
						className="h-8 w-8 text-purple-300 cursor-pointer font-extralight"
						onClick={() => document.querySelector<HTMLInputElement>("input[type='file']")?.click()}
					/>
					<h4 className="text-lg text-purple-400 font-extralight ">Seleccionar Archivos</h4>
				</div>
				
				<input
					type="file"
					onChange={handleFileChange} 
					className="hidden"
					accept=".xls,.xlsx"
				/>
			</div>

			{fileName && (
				<div className="my-3 text-purple-300 font-extralight">
					<strong>Archivo seleccionado:</strong> {fileName}
				</div>
			)}

			{errorExcel && (
				<div className="my-3 text-red-500">
					{errorExcel}. Por favor, descarga la plantilla y sube un archivo con el formato correcto.
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
					Archivo procesado exitosamente. Ahora puedes seleccionar los contactos.
				</div>
			)}

		
			<div className="flex flex-wrap justify-center gap-8">
				<div className="flex flex-col sm:flex-row sm:items-center gap-2">
					<FiDownload
						className="h-8 w-8 text-green-500 cursor-pointer"
						onClick={generateExcelFile}
					/>
					<h4 className="text-lg font-medium text-green-500 text-center sm:text-left">
						Descargar Plantilla
					</h4>
				</div>

				<div className="flex flex-col sm:flex-row sm:items-center gap-2">
					<FiUpload
						className={`h-8 w-8 text-blue-500 cursor-pointer ${
							errorExcel !== null ? "opacity-50 cursor-not-allowed" : ""
						}`}
						onClick={handleFileProcessWithClear} 
						title={errorExcel ? "Corrige el error para continuar" : "Procesar Archivo"}
					/>
					<h4
						className={`text-lg font-medium ${
							errorExcel !== null ? "text-gray-400" : "text-blue-500"
						} text-center sm:text-left`}
					>
						Procesar Archivo
					</h4>
				</div>
			</div>
		</div>
	);
};

export default ExcelUploader;
