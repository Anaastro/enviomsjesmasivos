import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { auth } from "@/config/firebaseAdmin";
import { GetServerSidePropsContext } from "next";
import nookies from "nookies";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    // const cookies = nookies.get(ctx);

    // const verifiedIdTokenResult = await auth.verifyIdToken(cookies.token);
    // const isAdmin = verifiedIdTokenResult.admin;

    // if (!isAdmin) {
    //   ctx.res.writeHead(302, { Location: "/" });
    //   ctx.res.end();
    // }

    const test = { test: true };

    return {
      props: {
        ...test,
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

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col w-full">
        <div className="flex justify-between items-center mb-5 px-10">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <div className="dark"></div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
