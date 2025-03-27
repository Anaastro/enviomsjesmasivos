import {
  ClientStatus,
  InstanceAllInformation,
  InstanceInformationResponse,
  InstanceResponse,
  InstancesResponse,
  PairingCodeData,
  RequestPairingCodeResponse,
} from "@/lib/interfaces/instances-responce.interface";

export default class InstancesService {
  static async getAllWaapiInstances(
    waapiApiKey: string
  ): Promise<InstancesResponse> {
    const fetchedInstances = await fetch("https://waapi.app/api/v1/instances", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${waapiApiKey}`,
      },
    });
    return await fetchedInstances.json();
  }

  static async getAllInstances(): Promise<InstanceAllInformation[]> {
    const rawData = await fetch(`/api/instances/getAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const { instances }: InstancesResponse = await rawData.json();

    const instancesInformation = await Promise.all(
      instances.map(async (instance) => {
        const instanceInformation = await this.getInformationInstance(
          instance.id
        );
        return {
          ...instance,
          ...instanceInformation,
        };
      })
    );

    return instancesInformation;
  }

  static async createWaapiInstance(
    waapiApiKey: string
  ): Promise<InstanceResponse> {
    const rawData = await fetch(`https://waapi.app/api/v1/instances`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${waapiApiKey}`,
      },
    });

    return await rawData.json();
  }

  static async createInstance(): Promise<InstanceResponse> {
    const rawData = await fetch(`/api/instances/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await rawData.json();
  }

  static async getInformationInstance(id: number): Promise<ClientStatus> {
    const rawData = await fetch(`/api/instances/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await rawData.json();
  }

  static async getWaapiInformationInstance(
    waapiApiKey: string,
    id: string
  ): Promise<InstanceInformationResponse> {
    const rawData = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/status`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${waapiApiKey}`,
        },
      }
    );
    return await rawData.json();
  }

  static async requestPairingCode(
    id: number,
    phone: string
  ): Promise<PairingCodeData> {
    const rawData = await fetch(`/api/instances/pairing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, phone }),
    });
    return await rawData.json();
  }

  static async requestWaapiPairingCode(
    waapiApiKey: string,
    id: string,
    phone: string
  ): Promise<RequestPairingCodeResponse> {
    const rawData = await fetch(
      `https://waapi.app/api/v1/instances/${id}/client/action/request-pairing-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${waapiApiKey}`,
        },
        body: JSON.stringify({ phoneNumber: phone }),
      }
    );
    return await rawData.json();
  }
}
