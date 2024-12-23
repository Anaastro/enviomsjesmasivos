import React from "react";
import { motion } from "framer-motion";
import styles from "./styles.module.css";
import Link from "next/link";

interface Props {
	name: string;
	rol: string;
	signOut: () => void;
}

export default function Dropdown({ name, rol, signOut }: Props) {
	const [isMouse, toggleMouse] = React.useState(false);
	const toggleMouseMenu = () => {
		toggleMouse(!isMouse);
	};
	const subMenuAnimate = {
		enter: {
			opacity: 1,
			rotateX: 0,
			transition: {
				duration: 0.3,
			},
			display: "block",
		},
		exit: {
			opacity: 0,
			rotateX: -15,
			transition: {
				duration: 0.3,
				delay: 0.15,
			},
			transitionEnd: {
				display: "none",
			},
		},
	};

	return (
		<div className="flex text-white">
			<motion.div
				className={styles.menu_item}
				onMouseEnter={toggleMouseMenu}
				onMouseLeave={toggleMouseMenu}
			>
				<p>{name}</p>
				<motion.div
					className={styles.sub_menu}
					initial="exit"
					animate={isMouse ? "enter" : "exit"}
					variants={subMenuAnimate}
				>
					<div className={styles.sub_menu_background} />
					<div className={`${styles.sub_menu_container}`}>
						{/* <div
							className={`${styles.sub_menu_item} px-2 py-1 mb-2 transition duration-300 hover:bg-[#27262d] rounded-lg`}
						>
							Submenu Item 1
						</div>
						<div
							className={`${styles.sub_menu_item} px-2 py-1 mb-2 transition duration-300 hover:text-[#818283] rounded-lg`}
						>
							Submenu Item 2
						</div> */}
						{rol === "admin" && (
							<div
								className={`${styles.sub_menu_item} px-2 py-1 mb-2 transition duration-300 text-[#006eef] hover:text-[#025ac1] rounded-lg`}
							>
								<Link href="/dashboard">Dashboard</Link>
							</div>
						)}
						<hr className="py-1" />
						<div
							className={`px-2 py-1 transition duration-300 text-[#f21261] hover:bg-[#451728] rounded-lg`}
						>
							<button onClick={signOut}>Cerrar Sesión</button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</div>
	);
}
