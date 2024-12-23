import React, { useState, useEffect, useContext } from "react";
import RegistrarIniciarSesion from "./RegistrarIniciarSesion";

type ConfiguracionProps = {
	onClose: () => void;
	onSignIn: ({ email, rol }: { email: string; rol: string }) => void;
	onSignOut: () => void;
};

const Configuracion: React.FC<ConfiguracionProps> = ({ onClose, onSignIn }) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
			<div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3 relative">
				<button
					className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
					onClick={onClose}
				>
					&times;
				</button>

				<RegistrarIniciarSesion onSignIn={onSignIn} onClose={onClose} />
			</div>
		</div>
	);
};

export default Configuracion;
