import React, { useState, useEffect } from 'react';

interface SentMessage {
  phone: string;
  date: string;
}

interface SentMessagesLogProps {
  sentMessages: SentMessage[];
  onSearch: (query: string) => void; // Función para manejar la búsqueda
  searchQuery: string; // El término de búsqueda actual
}

const SentMessagesLog: React.FC<SentMessagesLogProps> = ({ sentMessages, onSearch, searchQuery }) => {
  return (
    <div className="border p-6 bg-white shadow-xl rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-blue-600">Mensajes Enviados</h3>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar por número..."
        className="w-full p-2 mb-4 border rounded"
      />
      <ul className="list-disc list-inside max-h-40 overflow-y-auto space-y-2">
        {sentMessages.map((message, index) => (
          <li key={index}>
            {message.phone} - {message.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SentMessagesLog;

