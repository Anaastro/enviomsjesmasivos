import { useEffect, useMemo, useState } from "react";

interface SentMessage {
	phone: string;
	date: string;
}

export const useSentMessages = () => {
	const [sentMessages, setSentMessages] = useState<SentMessage[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");

	useEffect(() => {
		const storedMessages = localStorage.getItem("sentMessages");
		if (storedMessages) {
			setSentMessages(JSON.parse(storedMessages));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("sentMessages", JSON.stringify(sentMessages));
	}, [sentMessages]);

	const filteredSentMessages = useMemo(
		() =>
			sentMessages.filter((message) =>
				String(message.phone).includes(searchQuery)
			),
		[sentMessages, searchQuery]
	);

	return {
		sentMessages,
		setSentMessages,
		searchQuery,
		setSearchQuery,
		filteredSentMessages,
	};
};
