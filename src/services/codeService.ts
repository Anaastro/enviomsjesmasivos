import { database } from "@/lib/utils/firebase";
import {
	collection,
	addDoc,
	serverTimestamp,
	query,
	orderBy,
	limit,
	startAfter,
	getDocs,
	where,
	setDoc,
	doc,
} from "firebase/firestore";

export const generateCode = async () => {
	try {
		const newCode = Math.random().toString(36).substr(2, 9);
		const response = await addDoc(collection(database, "codes"), {
			code: newCode,
			used: false,
			createdAt: serverTimestamp(),
		});

		return {
			newData: {
				id: response.id,
				code: newCode,
				used: false,
				createdAt: new Date(),
			},
		};
	} catch (error) {
		console.error("Error al generar código:", error);
	}
};

export const fetchPaginatedCodes = async (pageSize = 10) => {
	const codesRef = collection(database, "codes");
	let q;

	q = query(codesRef, orderBy("createdAt", "desc"));

	const querySnapshot = await getDocs(q);
	const data = querySnapshot.docs.map((doc) => {
		const docData = doc.data();
		return {
			id: doc.id,
			code: docData.code,
			used: docData.used,
			createdAt: docData.createdAt.toDate(),
		};
	});

	return { data };
};

export const checkCode = async (code: string) => {
	try {
		const codesRef = collection(database, "codes");
		const q = query(codesRef, where("code", "==", code));

		const querySnapshot = await getDocs(q);

		if (querySnapshot.empty) {
			return { valid: false, message: "Código inválido" };
		}

		const id = querySnapshot.docs[0].id;
		const docData = querySnapshot.docs[0].data();

		if (docData.used) {
			return { valid: false, message: "Código ya utilizado" };
		}

		return { valid: true, message: "Código válido", id };
	} catch (error) {
		console.error("Error checking code: ", error);
		return { valid: false, message: "Error al verificar el código" };
	}
};

export const changeCodeStatus = async (id: string) => {
	try {
		await setDoc(doc(database, "codes", id), { used: true }, { merge: true });
	} catch (error) {
		console.error("Error al cambiar estado del código:", error);
	}
};
