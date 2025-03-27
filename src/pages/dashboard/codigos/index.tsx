import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { generateCode } from "@/services/codeService";
import TableCodes from "@/components/Dashboard/TableCodes";

interface Code {
  id: string;
  code: string;
  used: boolean;
  createdAt: Date;
}

const DashboardPage = () => {
  const handleGenerateCode = async () => {
    await generateCode();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Códigos de Registro</h1>
        </div>

        <div className="dark">
          <TableCodes />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
