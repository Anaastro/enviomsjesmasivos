import { Phone } from "@/lib/interfaces/phone";

interface Props {
	phones: Phone[];
	startIndex: number;
	handleStartIndexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	endIndex: number;
	handleEndIndexChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleSelectRange: () => void;
}

export const IndexSelector = ({
	phones,
	startIndex,
	handleStartIndexChange,
	endIndex,
	handleEndIndexChange,
	handleSelectRange,
}: Props) => {
	return (
		<div className="mb-4">
			<label className="block text-white font-bold mb-2">
				Selecciona rango de números:
			</label>
			<div className="flex space-x-2">
				<input
					type="number"
					min="1"
					max={phones.length}
					value={startIndex}
					onChange={handleStartIndexChange}
					className="p-2 border rounded w-full"
					placeholder="Inicio"
				/>
				<input
					type="number"
					min="1"
					max={phones.length}
					value={endIndex}
					onChange={handleEndIndexChange}
					className="p-2 border rounded w-full"
					placeholder="Fin"
				/>
				<button
					onClick={handleSelectRange}
					className="p-2 bg-green-500 text-white rounded"
				>
					Seleccionar Rango
				</button>
			</div>
		</div>
	);
};
