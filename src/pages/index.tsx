import Comunicador from "@/components/Comunicador";
import Configuracion from "@/components/Login/Configuracion";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { getAuth, signOut } from "firebase/auth";
import { LoggedContext } from "@/lib/context/LoggedContext";
import { doc, setDoc } from "firebase/firestore";
import { app, database } from "@/lib/utils/firebase";
import Link from "next/link";
import Loader from "@/components/Loader";
import { UserContext } from "@/lib/context/UserContext";
import ListPhoneNumbers from "@/components/Login/ListPhoneNumbers";

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

			const userDocRef = doc(database, "users", userUid);
			await setDoc(
				userDocRef,
				{ phone: "", sessionActive: false },
				{ merge: true }
			);

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
		<div
			className="min-h-screen flex flex-col items-center justify-center bg-gray-800 relative"
			style={{
				backgroundImage:
					"url(https://res.cloudinary.com/djr3d0fqg/image/upload/v1724692573/crmastro_mzgaem.gif)",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{!isConfigOpen && !userLoggedIn && (
				<>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className="bg-white text-black font-bold py-3 px-6 rounded-lg shadow-lg"
						onClick={() => setIsConfigOpen(true)}
					>
						Haz clic
					</motion.button>
					<p className="mt-96 text-white text-xl font-bold">
						Bienvenidos a CRM Astro
					</p>
				</>
			)}
			{isConfigOpen && !userLoggedIn && (
				<Configuracion
					onClose={() => setIsConfigOpen(false)}
					onSignIn={handleSignIn}
					onSignOut={handleSignOut}
				/>
			)}
			{userLoggedIn && user && !instanceId && <ListPhoneNumbers />}
			{userLoggedIn && user && instanceId && (
				<>
					{/* <div className="fixed top-4 left-1/2 transform -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-4 bg-white p-3 rounded-lg shadow-lg z-50 w-64 flex flex-col md:flex-row justify-center sm:w-auto sm:block">
						<span className="mb-4 md:mr-2">Sesión activa: {user?.email}</span>
						<div className="flex flex-col gap-2 md:mx-6 md:my-2">
							{user.rol === "admin" && (
								<Link
									className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 text-center"
									onClick={handleSignOut}
									href="/dashboard"
								>
									Ir al Dashboard
								</Link>
							)}
							<button
								className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
								onClick={handleSignOut}
							>
								Cerrar Sesión
							</button>
						</div>
					</div> */}
					<Comunicador
						name={user?.email}
						rol={user?.rol}
						signOut={handleSignOut}
					/>
				</>
			)}
		</div>
	);
};

export default Home;
