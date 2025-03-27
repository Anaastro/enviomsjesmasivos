import { Phone } from "@/lib/interfaces/phone";

interface Props {
  range: number;
  handleRangeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  phones: Phone[];
}

export const RangeSelector = ({ range, handleRangeChange, phones }: Props) => {
  return (
    <div className="mb-4">
      <label className="block font-bold text-white mb-2">
        Selecciona el número de contactos a mostrar:
      </label>
      <select
        value={range}
        onChange={handleRangeChange}
        className="p-2 border rounded mb-4 w-full"
      >
        {[phones.length, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 150, 200].map(
          (num) => (
            <option key={num} value={num}>
              {num === phones.length ? "Todos" : `${num} números`}
            </option>
          )
        )}
      </select>
    </div>
  );
};

export default RangeSelector;
