import { createContext, useState } from "react";

export const IsSentContext = createContext<{
	isSent: boolean;
	setIsSent: React.Dispatch<React.SetStateAction<boolean>>;
}>({
	isSent: false,
	setIsSent: () => {},
});

export const IsSentProvider = ({ children }: { children: React.ReactNode }) => {
	const [isSent, setIsSent] = useState(false);

	return (
		<IsSentContext.Provider value={{ isSent, setIsSent }}>
			{children}
		</IsSentContext.Provider>
	);
};
