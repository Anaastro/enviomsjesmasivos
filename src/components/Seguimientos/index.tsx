import CardSeguimientos from "../CardSeguimientos";

export default function Seguimientos() {
	return (
		<div className="flex flex-col justify-center items-center w-full h-screen gap-4">
			<h1 className="text-white text-2xl">Seguimientos</h1>

			<div className="grid grid-cols-3 gap-10">
				<CardSeguimientos
					title="Crear Prospectos"
					image="/images/astro-logo-blanco.png"
				/>
				<CardSeguimientos
					title="Buscar por telefono"
					image="/images/astro-logo-blanco.png"
				/>
				<CardSeguimientos
					title="Consultas recibidas"
					image="/images/astro-logo-blanco.png"
				/>
				<CardSeguimientos
					title="Acciones del dia"
					image="/images/astro-logo-blanco.png"
				/>
				<CardSeguimientos
					title="Informes"
					image="/images/astro-logo-blanco.png"
				/>
				<CardSeguimientos
					title="Ver tabla"
					image="/images/astro-logo-blanco.png"
				/>
			</div>
		</div>
	);
}
