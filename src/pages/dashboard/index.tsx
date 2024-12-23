import DashboardLayout from "@/components/Dashboard/DashboardLayout";

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
