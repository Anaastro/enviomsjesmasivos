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

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
		return () => unsubscribe();
	}, []);

	const handleAuthStateChange = async (user: any) => {
		if (user) {
			const userDocRef = doc(database, "users", user.uid);
			const userDoc = await getDoc(userDocRef);

			if (
				userDoc.exists() &&
				userDoc.data().sessionActive &&
				userDoc.data().deviceId !== getDeviceId()
			) {
				setErrorLoggedIn(true);
				await signOut(auth);
			} else {
				await setDoc(
					userDocRef,
					{
						sessionActive: false,
						deviceId: getDeviceId(),
						lastLogin: new Date().toISOString(),
					},
					{ merge: true }
				);
				setUserLoggedIn(false);
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
			const codeData = await checkCode(code);
			if (!codeData.valid) {
				setErrorCode(codeData.message);
				return;
			}
			setErrorCode(null);
			await changeCodeStatus(codeData.id!);

			const user = await createUserWithEmailAndPassword(auth, email, password);
			await setDoc(doc(database, "users", user.user.uid), {
				sessionActive: false,
				deviceId: getDeviceId(),
				lastLogin: new Date().toISOString(),
			});

			setDataModal({
				title: "Registro exitoso",
				content: "Usuario registrado exitosamente.",
				error: false,
			});
			onOpen();
		} catch (error) {
			console.error("Error al registrar usuario:", error);
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
			const deviceId = getDeviceId();
			const userDocRef = doc(database, "users", user.uid);
			const userDoc = await getDoc(userDocRef);

			if (
				userDoc.exists() &&
				userDoc.data().sessionActive &&
				userDoc.data().deviceId !== deviceId
			) {
				setErrorLoggedIn(true);
				throw new Error("Ya tienes una sesión activa en otro dispositivo.");
			}

			await setDoc(
				userDocRef,
				{
					sessionActive: true,
					deviceId,
					lastLogin: new Date().toISOString(),
				},
				{ merge: true }
			);

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
