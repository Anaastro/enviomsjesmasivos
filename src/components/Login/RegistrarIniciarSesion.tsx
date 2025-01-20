import { getAuth } from "firebase/auth";
import { app } from "@/lib/utils/firebase";
import ModalRegister from "./ModalRegister";
import Loader from "../Loader";
import useAuth from "@/lib/hooks/useAuth";

type Props = {
	onSignIn: ({ email, rol }: { email: string; rol: string }) => void;
	onClose: () => void;
};

const RegistrarIniciarSesion: React.FC<Props> = ({ onSignIn, onClose }) => {
	const {
		loading,
		isRegister,
		email,
		setEmail,
		password,
		setPassword,
		showPassword,
		setShowPassword,
		errorLoggedIn,
		errorCode,
		errorRegister,
		code,
		dataModal,
		isOpen,
		onOpenChange,
		setIsRegister,
		handleChangeCode,
		handleAuth,
		handlePasswordReset,
	} = useAuth({ onSignIn, onClose });

	return (
		<div className="bg-purple-700">
			{loading && (
				<Loader
					content={isRegister ? `Registrando usuario` : "Iniciando sesion"}
				/>
			)}

			<h2 className="text-xl font-extralight text-white mb-4 text-center ">
				{isRegister ? "Registrar" : "Iniciar Sesión"}
			</h2>
			<div className="mb-4">
				<label className="block mb-1 font-extralight text-white">
					Correo Electrónico:
				</label>
				<input
					type="email"
					className="border rounded-md p-2 w-full"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</div>
			<div className="mb-4">
				<label className="block mb-1 font-extralight text-white">
					Contraseña:
				</label>
				<div className="flex">
					<input
						type={showPassword ? "text" : "password"}
						className="border rounded-md p-2 w-full"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						type="button"
						className="font-extralight text-white ml-4"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? "Ocultar" : "Mostrar"}
					</button>
				</div>
			</div>

			{isRegister && (
				<div className="mb-4 text-black">
					<label className="block mb-1 font-extralight text-white">
						Codigo de registro:
					</label>
					<input
						type="text"
						name="code"
						value={code}
						className="border rounded-md p-2 w-full text-black "
						onChange={handleChangeCode}
					/>
				</div>
			)}

			{errorLoggedIn && (
				<p className="text-red-500 px-2 mb-4">
					Ya tienes una sesión activa en otro dispositivo
				</p>
			)}

			{errorCode && <p className="text-red-500 px-2 mb-4">{errorCode}</p>}

			{errorRegister && (
				<p className="text-red-500 px-2 mb-4">{errorRegister}</p>
			)}

			<button
				className="bg-[#9CFFCB] text-[#071830] px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
				onClick={handleAuth}
			>
				{isRegister ? "Registrar" : "Iniciar Sesión"}
			</button>

			<ModalRegister
				content={dataModal.content}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				setIsRegister={setIsRegister}
				title={dataModal.title}
			/>

			{!isRegister && (
				<button
					className="text-[#9CFFCB] hover:underline mb-4"
					onClick={handlePasswordReset}
				>
					¿Olvidaste tu contraseña?
				</button>
			)}

			<button
				className="text-white hover:underline"
				onClick={() => setIsRegister(!isRegister)}
			>
				{isRegister
					? "¿Ya tienes una cuenta? Inicia Sesión"
					: "¿No tienes una cuenta? Regístrate"}
			</button>
		</div>
	);
};

export default RegistrarIniciarSesion;
