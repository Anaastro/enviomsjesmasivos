interface Props {
	openModal: () => void;
	handleDelete: () => void;
}

export const ActionButtons = ({ openModal, handleDelete }: Props) => {
	return (
		<div className="grid grid-cols-2 gap-3">
			<button
				onClick={openModal}
				className="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
			>
				Agregar Número
			</button>
			<button
				onClick={handleDelete}
				className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
			>
				Eliminar Seleccionados
			</button>
		</div>
	);
};
