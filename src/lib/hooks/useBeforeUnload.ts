import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";

export const useBeforeUnload = () => {
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setUserId(user.uid);
			} else {
				setUserId(null);
			}
		});

		return () => unsubscribe();
	}, []);

	const sendSessionUpdate = async (userId: string) => {
		const url = `/api/updateSession`;

		const data = {
			uid: userId,
			sessionActive: false,
			phone: "",
		};

		const blob = new Blob([JSON.stringify(data)], {
			type: "application/json",
		});

		navigator.sendBeacon(url, blob);
	};

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (userId) {
				sendSessionUpdate(userId);
			} else {
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [userId]);
};
