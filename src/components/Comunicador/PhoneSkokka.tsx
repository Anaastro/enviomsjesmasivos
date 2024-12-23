import React from "react";
import { countryList, regionList } from "@/lib/utils/regionList";

interface PhoneSkkokaProps {
	formLocation: {
		country: string;
		region: string;
		pages: number;
		error: string;
	};
	setFormLocation: (location: any) => void;
	handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PhoneSkkoka: React.FC<PhoneSkkokaProps> = ({
	formLocation,
	setFormLocation,
	handleSubmit,
}) => (
	<form className="mb-2" onSubmit={handleSubmit}>
		<div className="flex justify-around items-center flex-wrap gap-y-4 mb-2">
			<select
				value={formLocation.country}
				onChange={(e) =>
					setFormLocation({ ...formLocation, country: e.target.value })
				}
				className="p-2 border rounded mr-2 w-full lg:w-auto"
			>
				<option value="">Selecciona país</option>
				{countryList.map(({ code, name }) => (
					<option key={code} value={code}>
						{name}
					</option>
				))}
			</select>

			<select
				value={formLocation.region}
				onChange={(e) =>
					setFormLocation({ ...formLocation, region: e.target.value })
				}
				className="p-2 border rounded mr-2 w-full lg:w-auto"
			>
				<option value="">Selecciona región</option>
				{formLocation.country &&
					regionList[formLocation.country].regions.map((region) => (
						<option key={region} value={region}>
							{region}
						</option>
					))}
			</select>

			<select
				value={formLocation.pages}
				onChange={(e) =>
					setFormLocation({
						...formLocation,
						pages: Number(e.target.value),
					})
				}
				className="p-2 border rounded mr-2 w-full lg:w-auto"
			>
				{Array.from({ length: 10 }, (_, i) => (
					<option key={i + 1} value={i + 1}>
						{i + 1}
					</option>
				))}
			</select>
		</div>

		{formLocation.error && (
			<p className="text-red-600 text-sm my-2">{formLocation.error}</p>
		)}

		<div className="flex justify-center items-center">
			<button className="bg-blue-600 p-2 text-white rounded-lg" type="submit">
				Obtener numeros
			</button>
		</div>
	</form>
);

export default PhoneSkkoka;
