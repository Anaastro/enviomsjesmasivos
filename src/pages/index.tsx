import Comunicador from "@/components/Comunicador";
import Configuracion from "@/components/Login/Configuracion";
import React, { useContext, useState } from "react";
import { motion } from "framer-motion";

import { getAuth, signOut } from "firebase/auth";
import { LoggedContext } from "@/lib/context/LoggedContext";
import { app } from "@/lib/utils/firebase";
import { UserContext } from "@/lib/context/UserContext";
import ListPhoneNumbers from "@/components/Login/ListPhoneNumbers";
import ParticlesBackgroud from "@/components/ParticlesBackground";

interface User {
	email: string;
	rol: string;
}

const Home: React.FC = () => {
	const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
	const { userLoggedIn, setUserLoggedIn, errorLoggedIn } =
		useContext(LoggedContext);
	const [user, setUser] = useState<User | null>(null);
	const { instanceId, setInstanceId } = useContext(UserContext);

	const auth = getAuth(app);

	const handleSignOut = async () => {
		try {
			if (!auth.currentUser) return;
			const userUid = auth.currentUser.uid;

			await signOut(auth);

			// const userDocRef = doc(database, "users", userUid);
			// await setDoc(
			// 	userDocRef,
			// 	{ phone: "", sessionActive: false },
			// 	{ merge: true }
			// );

			setUserLoggedIn(false);
			setIsConfigOpen(true);
			setInstanceId(null);
			setUser(null);
		} catch (error) {
			console.error("Error al cerrar sesión:", error);
		}
	};

	const handleSignIn = ({ email, rol }: User) => {
		if (errorLoggedIn) return;
		setUserLoggedIn(true);
		setIsConfigOpen(false);
		if (!rol) {
			setUser({ email, rol: "user" });
			return;
		}
		setUser({ email, rol });
	};

	return (
		<>
			<div className="min-h-screen flex flex-col items-center justify-center bg-black relative">
				<ParticlesBackgroud />
				<div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-6 sm:space-y-0">
					<img
						src="/images/icons-12934.gif"
						alt="Imagen 1"
						className="w-3/4 sm:w-1/3 h-auto"
					/>
					<img
						src="/images/whatsapp-2223.gif"
						alt="Imagen 2"
						className="w-3/4 sm:w-1/3 h-auto"
					/>
					<img
						src="/images/astro-logo-blanco.png"
						alt="Logo de Astro"
						className="w-60 h-60 animate-pulse"
					/>
				</div>

				{!isConfigOpen && !userLoggedIn && (
					<>
						<motion.button
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="bg-purple-700 text-white font-extralight py-3 px-6 rounded-lg shadow-lg z-30"
							onClick={() => setIsConfigOpen(true)}
						>
							Haz clic
						</motion.button>
					</>
				)}
				{isConfigOpen && (
					<Configuracion
						onClose={() => setIsConfigOpen(false)}
						onSignIn={handleSignIn}
						onSignOut={handleSignOut}
					/>
				)}
				{userLoggedIn && user && !instanceId && <ListPhoneNumbers />}
				{userLoggedIn && user && instanceId && (
					<>
						<Comunicador
							name={user?.email}
							rol={user?.rol}
							signOut={handleSignOut}
						/>
					</>
				)}
			</div>
		</>
	);
};

export default Home;
