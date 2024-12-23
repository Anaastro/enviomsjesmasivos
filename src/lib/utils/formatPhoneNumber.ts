export function formatPhoneNumber(phone: string): string {
	const countryCode = "+591";
	const phoneStr = String(phone).trim().replaceAll(" ", "");

	if (!phoneStr.startsWith(countryCode)) {
		return `${countryCode}${phoneStr}`;
	}

	return phoneStr;
}
