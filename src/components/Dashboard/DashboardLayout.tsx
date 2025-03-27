import { useState } from "react";
import { CodeIcon, HomeIcon } from "../Icons";
import ButtonNav from "./ButtonNav";

const DashboardLayout = ({ children }: any) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	const closeMenu = () => {
		setIsOpen(false);
	};

	return (
		<div className="flex min-h-screen bg-gray-900 text-white">
			<aside
				className={`fixed inset-y-0 left-0 z-30 w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} md:translate-x-0`}
			>
				<div className="p-4 flex justify-between items-center">
					<div className="font-bold text-lg">Dashboard</div>
					<button
						onClick={closeMenu}
						className="text-white focus:outline-none md:hidden"
					>
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<nav className="mt-4 text-white">
					<ul className="flex flex-col [&>li]:py-4 [&>li]:px-6">
						<ButtonNav
							href={"/dashboard"}
							closeMenu={closeMenu}
							icon={<HomeIcon />}
							label="Inicio"
						/>
						<ButtonNav
							href={"/dashboard/codigos"}
							closeMenu={closeMenu}
							icon={<CodeIcon />}
							label="Códigos"
						/>
						<ButtonNav
							href={"/dashboard/usuarios"}
							closeMenu={closeMenu}
							icon={<CodeIcon />}
							label="Usuarios"
						/>
						<ButtonNav
							href={"/dashboard/instancias"}
							closeMenu={closeMenu}
							icon={<CodeIcon />}
							label="Usuarios"
						/>
					</ul>
				</nav>
			</aside>

			<div className="flex-1 p-6 md:ml-64">
				<button
					onClick={toggleMenu}
					className="md:hidden p-2 text-white focus:outline-none"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16m-7 6h7"
						/>
					</svg>
				</button>

				{children}
			</div>
		</div>
	);
};

export default DashboardLayout;
