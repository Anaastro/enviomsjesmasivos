import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai"; 

interface Props {
	openModal: () => void;
	handleDelete: () => void;
}

export const ActionButtons = ({ openModal, handleDelete }: Props) => {
	return (
		<div className="flex justify-center items-center gap-6 ">
			{/* Botón de Agregar Número */}
			<button
				onClick={openModal}
				className="flex items-center gap-2 text-green-500 hover:text-green-600"
			>
				<AiOutlinePlus size={24} />
				<span>Agregar Número</span>
			</button>

			{/* Botón de Eliminar Seleccionados */}
			<button
				onClick={handleDelete}
				className="flex items-center gap-2 text-red-500 hover:text-red-600"
			>
				<AiOutlineDelete size={24} />
				<span>Eliminar Seleccionados</span>
			</button>
		</div>
	);
};
