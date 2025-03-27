export const clientService = {
  getInformation: async ({ instanceId }: { instanceId: string }) => {
    const response = await fetch("/api/getInformation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instanceId }),
    });

    const data = await response.json();
    return data;
  },

  async getStatus({ instanceId }: { instanceId: string }) {
    const response = await fetch("/api/instanceStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instanceId }),
    });
    return await response.json();
  },

  async getQr({ instanceId }: { instanceId: string }) {
    const response = await fetch(`/api/getQr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ instanceId }),
    });

    const data = await response.json();
    const { qrCode } = data;

    return qrCode;
  },

  async getStatusInstance({
    instanceId,
    waapiApiKey,
  }: {
    instanceId: string;
    waapiApiKey: string;
  }) {
    const response = await fetch(
      `https://waapi.app/api/v1/instances/${instanceId}/client/status`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${waapiApiKey}`,
        },
      }
    );

    return await response.json();
  },

  async getQrCode({
    waapiApiKey,
    instanceId,
  }: {
    waapiApiKey: string;
    instanceId: string;
  }) {
    const response = await fetch(
      `https://waapi.app/api/v1/instances/${instanceId}/client/qr`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${waapiApiKey}`,
        },
      }
    );

    return await response.json();
  },

  async getClientInformation({
    waapiApiKey,
    instanceId,
  }: {
    waapiApiKey: string;
    instanceId: string;
  }) {
    const instanceIdNumber = +instanceId;

    const response = await fetch(
      `https://waapi.app/api/v1/instances/${instanceIdNumber}/client/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${waapiApiKey}`,
        },
      }
    );
    return await response.json();
  },
};
