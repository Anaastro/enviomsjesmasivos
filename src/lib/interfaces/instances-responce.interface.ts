export interface InstancesResponse {
  instances: Instance[];
  status?: string;
}

export interface Instance {
  id: number;
  owner: string;
  name: string;
  webhook_events: any[];
}

export interface InstanceResponse {
  instance: Instance;
  status: string;
}

export interface Instance {
  id: number;
  name: string;
  owner: string;
  webhook_url: string;
  webhook_events: any[];
  is_trial: number;
}

export interface InstanceInformationResponse {
  clientStatus: ClientStatus;
  links: Links;
  status: string;
}

export interface ClientStatus {
  status: string;
  instanceId: number;
  name: string;
  data: null;
  instanceStatus: string;
  instanceWebhook: string;
  instanceEvents: Array<string[]>;
}

export interface Links {
  self: string;
}

// export interface InstanceAllInformation {
// 	status: string;
// 	instanceId: number;
// 	name: string;
// 	data: null;
// 	instanceStatus: string;
// 	instanceWebhook: string;
// 	instanceEvents: Array<string[]>;
// 	id: number;
// 	owner: string;
// 	webhook_events: any[];
// 	webhook_url: string;
// 	is_trial: number;
// }

export interface InstanceAllInformation extends Instance, ClientStatus {}

export interface RequestPairingCodeResponse {
  data: RequestPairingData;
  links: Links;
  status: string;
}

export interface RequestPairingData {
  status: string;
  instanceId: number;
  data: PairingCodeData;
}

export interface PairingCodeData {
  pairingCode: string;
}

export interface Links {
  self: string;
}
