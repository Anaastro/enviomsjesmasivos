import Image from "next/image";
import Dropdown from "../Dropdown";
import { Auth } from "firebase/auth";
import MenuMobile from "../MenuMobile";

interface Props {
	name: string;
	rol: string;
	signOut: () => void;
}

export default function NavbarCrm({ name, rol, signOut }: Props) {
	return (
		<div>
			<div className="hidden md:flex w-full h-auto justify-between items-center p-2 gap-5 pt-40 md:pt-0 bg-black">
				<div className="flex-1"></div>
				<div className="flex items-center">
					<Image
						src="/images/logoastro.png"
						alt="Astro Logo"
						width={75}
						height={75}
					/>
					<h1 className="text-white font-bold text-4xl">CRM ASTRO</h1>
				</div>
				<div className="flex-1 justify-items-end">
					<Dropdown name={name} rol={rol} signOut={signOut} />
				</div>
			</div>
			<div className="md:hidden">
				<MenuMobile name={name} rol={rol} signOut={signOut} />
			</div>
		</div>
	);
}
