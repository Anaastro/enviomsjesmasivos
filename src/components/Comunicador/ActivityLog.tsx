import React from 'react';

interface ActivityLogProps {
  log: string[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ log }) => {
  return (
    <div className="border p-6 bg-white shadow-xl rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-yellow-600">Log de Actividad</h3>
      <ul className="list-disc list-inside max-h-20 overflow-y-auto space-y-2">
        {log.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
