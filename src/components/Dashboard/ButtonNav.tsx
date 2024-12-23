import Link from "next/link";
import React from "react";

interface Props {
	href: string;
	icon: React.ReactNode;
	label: string;
	closeMenu: () => void;
}

export default function ButtonNav({ href, icon, label, closeMenu }: Props) {
	return (
		<li className="hover:bg-white hover:text-black [&>a]:flex [&>a]:gap-4 transition-all duration-200">
			<Link href={href} onClick={closeMenu} className="flex items-center gap-4">
				<span className="transition duration-200 group-hover:text-blue-400">
					{icon}
				</span>
				<span>{label}</span>
			</Link>
		</li>
	);
}
