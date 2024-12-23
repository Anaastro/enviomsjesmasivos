import { user } from "@nextui-org/react";

interface PropsGetSk {
	locationCountryCode: string;
	locationRegion: string;
	pageNumber: number;
	userId: string;
}

export async function getSkNumbers({
	locationCountryCode,
	locationRegion,
	pageNumber,
	userId,
}: PropsGetSk) {
	try {
		const response = await fetch(
			"https://us-central1-sistemas-astro.cloudfunctions.net/getSkNumbers",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					locationCountryCode: locationCountryCode,
					locationRegion: locationRegion,
					pageNumber: pageNumber,
					userId: userId,
				}),
			}
		);

		const contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			return await response.json();
		} else {
			const text = await response.text();
			throw new Error(`Error en la respuesta del servidor: ${text}`);
		}
	} catch (error: any) {
		throw new Error(`Error en la petición: ${error.message}`);
	}
}
