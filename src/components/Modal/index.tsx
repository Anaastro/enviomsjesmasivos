import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ isOpen, onClose, children }: any) {
	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className="bg-white p-6 rounded-lg shadow-lg w-96"
						initial={{ y: 50, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -50, opacity: 0 }}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="absolute top-2 right-2 text-gray-600"
							onClick={onClose}
						>
							✕
						</button>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
