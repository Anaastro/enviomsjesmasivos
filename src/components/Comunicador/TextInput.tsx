import React, { useState } from "react";

interface TextInputProps {
  setStatusMessages: React.Dispatch<React.SetStateAction<string[]>>;
  setLog: React.Dispatch<React.SetStateAction<string[]>>;
  phones: string[];
}

const TextInput: React.FC<TextInputProps> = ({
  setStatusMessages,
  setLog,
  phones,
}) => {
  const [textMessage, setTextMessage] = useState("");

  const handleSendMessages = () => {
    phones.forEach((phone) => {
      const status = `Mensaje enviado a ${phone}`;
      setStatusMessages((prev) => [...prev, status]);
      setLog((prev) => [...prev, `Mensaje enviado a ${phone}`]);
    });
  };

  return (
    <div className="border p-4 bg-white shadow rounded">
      <h3 className="text-lg font-semibold mb-2">Escribir Mensaje</h3>
      <textarea
        className="w-full p-2 border rounded"
        value={textMessage}
        onChange={(e) => setTextMessage(e.target.value)}
        placeholder="Escribe tu mensaje aquí"
      />
      <button
        onClick={handleSendMessages}
        className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Enviar Mensajes
      </button>
    </div>
  );
};

export default TextInput;
