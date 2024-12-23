import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "../Icons";

interface Props {
	name: string;
	rol: string;
	signOut: () => void;
}

const MenuMobile = ({ name, rol, signOut }: Props) => {
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	const hideNavItemsVariant = {
		opened: {
			opacity: 0,
			y: "-100%",
			transition: {
				duration: 0.5,
				ease: "easeInOut",
			},
		},
		closed: {
			opacity: 1,
			y: "0%",
			transition: {
				delay: 1.1,
				duration: 0.5,
				ease: "easeInOut",
			},
		},
	};

	const mobileMenuVariant = {
		opened: {
			y: "0%",
			transition: {
				delay: 0.15,
				duration: 1.1,
				ease: [0.74, 0, 0.19, 1.02],
			},
		},
		closed: {
			y: "-100%",
			transition: {
				delay: 0.35,
				duration: 0.63,
				ease: [0.74, 0, 0.19, 1.02],
			},
		},
	};

	const fadeInVariant = {
		opened: {
			opacity: 1,
			transition: {
				delay: 1.2,
			},
		},
		closed: { opacity: 0 },
	};

	const ulVariant = {
		opened: {
			transition: {
				delayChildren: 1,
				staggerChildren: 0.18,
			},
		},
		closed: {
			transition: {
				staggerChildren: 0.06,
				staggerDirection: -1,
			},
		},
	};

	const liVariant = {
		opened: {
			opacity: 1,
			y: "0%",
			transition: {
				duration: 0.65,
				ease: "easeOut",
			},
		},
		closed: {
			opacity: 0,
			y: "100%",
			transition: {
				duration: 0.25,
				ease: "easeInOut",
			},
		},
	};

	return (
		<motion.nav
			className="nav flex justify-between items-center px-4 py-5 text-white"
			initial="closed"
			animate={mobileNavOpen ? "opened" : "closed"}
		>
			<div className={`${styles.logo_container} placeholder:r-5`}>
				<Image
					src="/images/logoastro.png"
					alt="Astro Logo"
					width={75}
					height={75}
				/>
				<motion.h1 variants={hideNavItemsVariant}>CRM ASTRO</motion.h1>
			</div>
			<div className={styles.menu_container}>
				<motion.div
					variants={hideNavItemsVariant}
					onClick={() => setMobileNavOpen(true)}
				>
					<MenuIcon />
				</motion.div>
			</div>
			<motion.div variants={mobileMenuVariant} className={styles.mobile_menu}>
				<motion.button
					variants={fadeInVariant}
					onClick={() => setMobileNavOpen(false)}
				>
					Cerrar
				</motion.button>
				<motion.ul variants={ulVariant}>
					{rol === "admin" && (
						<motion.li whileTap={{ scale: 0.95 }}>
							<motion.div variants={liVariant}>
								<Link
									href="/dashboard"
									className="text-[#006eef] hover:text-[#025ac1] px-2 py-1 rounded-md text-center"
								>
									Dashboard
								</Link>
							</motion.div>
						</motion.li>
					)}

					<motion.li whileTap={{ scale: 0.95 }}>
						<motion.div variants={liVariant}>
							<button
								onClick={signOut}
								className="!text-[#f21261] hover:bg-[#451728] px-2 py-1 rounded-md text-center"
							>
								Cerrar Sesión
							</button>
						</motion.div>
					</motion.li>
				</motion.ul>
				<motion.div variants={fadeInVariant} className={styles.contact}>
					<h5>Usuario: {name}</h5>
				</motion.div>
			</motion.div>
		</motion.nav>
	);
};

export default MenuMobile;
