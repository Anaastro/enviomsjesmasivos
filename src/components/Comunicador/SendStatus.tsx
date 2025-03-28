import React from "react";

interface SendStatusProps {
  statusMessages: string[];
}

const SendStatus: React.FC<SendStatusProps> = ({ statusMessages }) => {
  return (
    <div className="border p-6 bg-white shadow-xl rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-green-600">
        Resultados de Envío
      </h3>
      <ul className="list-disc list-inside max-h-20 overflow-y-auto space-y-2">
        {statusMessages.map((status, index) => (
          <li key={index} className="text-green-500">
            {status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SendStatus;
