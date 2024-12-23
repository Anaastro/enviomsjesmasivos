import {
	addDoc,
	collection,
	collectionGroup,
	deleteDoc,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { database } from "@/lib/utils/firebase";
import { getAuth } from "firebase/auth";
import { create } from "domain";
import { Phone } from "@/lib/interfaces/phone";

const auth = getAuth();

export const contactService = {
	async addContact(phone: Phone) {
		const user = auth.currentUser;
		if (!user) {
			console.error("No hay usuario autenticado");
			return;
		}

		const userId = user.uid;
		const userContactsRef = doc(database, "contacts", userId);

		await setDoc(userContactsRef, {
			userId: userId,
			createdAt: new Date(),
		});

		try {
			const phonesCollectionRef = collection(userContactsRef, "phones");

			await addDoc(phonesCollectionRef, {
				id: phone.id,
				name: phone.name,
				phone: phone.phone,
				addedAt: new Date(),
			});
		} catch (error) {
			console.error("Error al añadir contacto:", error);
		}
	},

	async getContacts() {
		const user = auth.currentUser;
		if (!user) {
			console.error("No hay usuario autenticado");
			return;
		}
		const q = query(
			collection(database, "contacts"),
			where("userId", "==", user.uid)
		);

		try {
			const querySnapshot = await getDocs(q);
			const contacts: any[] = [];

			querySnapshot.forEach((doc) => {
				const data = doc.data();
				if (data.userId === user.uid) {
					contacts.push({
						id: doc.id,
						phone: data.phone,
					});
				}
			});

			return contacts;
		} catch (error) {
			console.error("Error al obtener contactos:", error);
		}
	},

	async updateContact(id: string, phone: string) {
		const user = auth.currentUser;
		if (!user) {
			console.error("No hay usuario autenticado");
			return;
		}
		const docRef = doc(database, "contacts", id);

		try {
			await setDoc(docRef, { phone }, { merge: true });
		} catch (error) {
			console.error("Error al modificar contacto:", error);
		}
	},

	async deleteContact(userId: string, phoneId: string) {
		try {
			const phonesCollectionRef = query(
				collection(database, "contacts", userId, "phones"),
				where("id", "==", phoneId)
			);
			const querySnapshot = await getDocs(phonesCollectionRef);

			if (!querySnapshot.empty) {
				const docRef = querySnapshot.docs[0].ref;
				await deleteDoc(docRef);
			} else {
				console.error(
					"No se encontró ningún documento en 'contacts' con el userId proporcionado."
				);
			}
		} catch (error) {
			console.error("Error al eliminar el teléfono:", error);
			throw error;
		}
	},
};
