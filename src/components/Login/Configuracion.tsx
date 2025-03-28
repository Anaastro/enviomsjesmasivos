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
      <div className=" bg-purple-700 p-6 rounded-lg shadow-white w-11/12 md:w-1/3 relative border-2 border-white shadow-2xl ">
        <button
          className="absolute top-4 right-4 text-white hover:text-gray-800 text-2xl"
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
