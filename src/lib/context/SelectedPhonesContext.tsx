import { createContext, useState } from "react";

interface SelectedPhonesContextProps {
	lastSelectedPhone: LastSelectedPhone;
	setLastSelectedPhone: React.Dispatch<React.SetStateAction<LastSelectedPhone>>;
}

interface LastSelectedPhone {
	index: number;
	sent: number;
}

export const SelectedPhonesContext = createContext<SelectedPhonesContextProps>({
	lastSelectedPhone: {
		index: -1,
		sent: -1,
	},
	setLastSelectedPhone: () => {},
});

export const SelectedPhonesProvider = ({
	children,
}: {
	children: JSX.Element;
}) => {
	const [lastSelectedPhone, setLastSelectedPhone] = useState<LastSelectedPhone>(
		{
			index: -1,
			sent: -1,
		}
	);

	return (
		<SelectedPhonesContext.Provider
			value={{ lastSelectedPhone, setLastSelectedPhone }}
		>
			{children}
		</SelectedPhonesContext.Provider>
	);
};
