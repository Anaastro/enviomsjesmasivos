import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { generateCode } from "@/services/codeService";
import TableCodes from "@/components/Dashboard/TableCodes";
import TableUsers from "@/components/Dashboard/TableUsers";

import nookies from "nookies";
import { GetServerSidePropsContext } from "next";
import { auth } from "@/config/firebaseAdmin";

interface Code {
  id: string;
  code: string;
  used: boolean;
  createdAt: Date;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);

    const verifiedIdTokenResult = await auth.verifyIdToken(cookies.token);
    const isAdmin = verifiedIdTokenResult.admin;

    if (!isAdmin) {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    }

    //  Desde aqui se llama a la base de datos para obtener los usuarios

    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
    }));

    return {
      props: {
        users,
      },
    };
  } catch (err) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};

const DashboardPage = ({ users }: { users: any }) => {
  // console.log(users, "users");

  const handleGenerateCode = async () => {
    await generateCode();
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold">Usuarios</h1>
        </div>

        <div className="dark">
          <TableUsers />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
