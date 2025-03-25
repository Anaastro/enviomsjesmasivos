import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { LoggedContext } from "../context/LoggedContext";
import { useDisclosure } from "@nextui-org/react";
import {
	createUserWithEmailAndPassword,
	onAuthStateChanged,
	sendPasswordResetEmail,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { auth, database } from "../utils/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { changeCodeStatus, checkCode } from "@/services/codeService";

type Props = {
	onSignIn: ({ email, rol }: { email: string; rol: string }) => void;
	onClose: () => void;
};

const getDeviceId = (): string => {
	let deviceId = localStorage.getItem("deviceId");
	if (!deviceId) {
		deviceId = crypto.randomUUID();
		localStorage.setItem("deviceId", deviceId);
	}
	return deviceId;
};

const useAuth = ({ onSignIn, onClose }: Props) => {
	const [isRegister, setIsRegister] = useState(true);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [code, setCode] = useState("");
	const [errorCode, setErrorCode] = useState<string | null>(null);
	const [errorRegister, setErrorRegister] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const { setUser } = useContext(UserContext);
	const { errorLoggedIn, setErrorLoggedIn, setUserLoggedIn } =
		useContext(LoggedContext);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [dataModal, setDataModal] = useState({
		title: "",
		content: "",
		error: false,
	});

	const { setInstanceId } = useContext(UserContext);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
		return () => unsubscribe();
	}, []);

	const handleAuthStateChange = async (user: any) => {
		if (user) {
			const userDocRef = doc(database, "users", user.uid);
			const userDoc = await getDoc(userDocRef);

			if (userDoc.exists()) {
				setUserLoggedIn(true);
			}
		} else {
			setUser(null);
		}
	};

	const handleAuth = async () => {
		setLoading(true);
		setErrorLoggedIn(false);
		setErrorRegister(null);

		try {
			if (isRegister) await registerUser();
			else await loginUser();
		} catch (error) {
			console.error("Error en la autenticación", error);
		} finally {
			setLoading(false);
		}
	};

	const registerUser = async () => {
		try {
			// Validar código
			const codeData = await checkCode(code);
			if (!codeData.valid) {
				setErrorCode(codeData.message);
				return;
			}
			setErrorCode(null);

			if (codeData.id) {
				await changeCodeStatus(codeData.id);
			} else {
				throw new Error("ID del código no encontrado.");
			}

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;

			const userDocRef = doc(database, "users", user.uid);
			const userDocSnapshot = await getDoc(userDocRef);

			if (!userDocSnapshot.exists()) {
				await setDoc(userDocRef, {
					sessionActive: false,
					lastLogin: new Date().toISOString(),
				});
			} else {
				throw new Error("El documento del usuario ya existe.");
			}

			setDataModal({
				title: "Registro exitoso",
				content: "Usuario registrado exitosamente.",
				error: false,
			});

			onOpen();
		} catch (error: any) {
			const errorMessage =
				error.message || "Error desconocido al registrar usuario.";
			setDataModal({
				title: "Error en el registro",
				content: errorMessage,
				error: true,
			});
			console.error("Error al registrar usuario:", errorMessage);
		}
	};

	const loginUser = async () => {
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			const userDocRef = doc(database, "users", user.uid);
			const userDoc = await getDoc(userDocRef);

			const userDocData = userDoc.data();
			const instanceId = userDocData?.instanceId || null;

			if (instanceId) {
				setInstanceId(instanceId);
			}

			if (userDoc.exists()) {
				const userRole = userDoc.data().rol || "user";
				onSignIn({ email: user.email!, rol: userRole });
			}
			onClose();
		} catch (error: any) {
			console.error("Error en el inicio de sesión:", error.message);
		}
	};

	const handlePasswordReset = async () => {
		try {
			await sendPasswordResetEmail(auth, email);
			alert("Correo de restablecimiento de contraseña enviado.");
		} catch (error) {
			console.error(
				"Error al enviar el correo de restablecimiento de contraseña:",
				error
			);
		}
	};

	const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		if (value.length > 9)
			setErrorCode("El código no puede tener más de 9 caracteres");
		else setErrorCode(null);
		setCode(value);
	};

	return {
		loading,
		isRegister,
		setIsRegister,
		email,
		setEmail,
		password,
		setPassword,
		showPassword,
		setShowPassword,
		errorLoggedIn,
		setErrorLoggedIn,
		errorRegister,
		setErrorRegister,
		code,
		setCode,
		handleChangeCode,
		handleAuth,
		handlePasswordReset,
		dataModal,
		setDataModal,
		errorCode,
		setErrorCode,
		isOpen,
		onOpenChange,
	};
};

export default useAuth;
