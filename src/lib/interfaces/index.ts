export interface Instance {
	id: number;
	owner: string;
	webhook_events: string[];
}

export interface InstanceStatus {
	clientStatus: ClientStatus;
	links: Links;
	status: string;
}

export interface ClientStatus {
	status: string;
	instanceId: string;
	data: null;
	instanceStatus: string;
	instanceWebhook: string;
	instanceEvents: string[];
}

export interface Links {
	self: string;
}

export interface ClientInformation {
	status: string;
	instanceId: string;
	data: Data;
}

export interface Data {
	displayName: string;
	contactId: string;
	formattedNumber: string;
}

export interface InstanceNumber {
	instanceId: string;
	phoneNumber: string;
	message: string;
	name: string;
}

export interface Chat {
	id: string;
	name: string;
	lastMessageTime: string;
	text?: string;
	image?: string;
}

export enum OptionsFilter {
	ALL = "all",
	LAST30 = "last30",
	LAST50 = "last50",
}
