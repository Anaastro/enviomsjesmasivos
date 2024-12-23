import React, { useState, useEffect } from "react";
import { FaUser, FaCog, FaSignInAlt } from "react-icons/fa";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
	getFirestore,
	collection,
	query,
	onSnapshot,
} from "firebase/firestore";
import Configuracion from "@/components/Login/Configuracion";
import { app } from "@/lib/utils/firebase";
import { Product } from "@/components/Productos/types";

const auth = getAuth(app);
const firestore = getFirestore(app);

type SidebarProps = {
	onSelectCategory: (category: string) => void;
	selectedCategory: string;
	onSelectProduct: (product: Product) => void;
	selectedProduct: Product | null;
};

const Sidebar: React.FC<SidebarProps> = ({
	onSelectCategory,
	selectedCategory,
	onSelectProduct,
	selectedProduct,
}) => {
	const [user, setUser] = useState<any>(null);
	const [showConfig, setShowConfig] = useState(false);
	const [categories, setCategories] = useState<
		{ id: string; name: string; products: Product[] }[]
	>([]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const q = query(collection(firestore, "categories"));
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const categoriesData: {
				id: string;
				name: string;
				products: Product[];
			}[] = [];
			querySnapshot.forEach((doc) => {
				const categoryData = {
					id: doc.id,
					name: doc.data().name,
					products: [] as Product[],
				};
				const productsQuery = query(
					collection(firestore, "categories", doc.id, "products")
				);
				const productsUnsubscribe = onSnapshot(
					productsQuery,
					(productsSnapshot) => {
						const productsData: Product[] = [];
						productsSnapshot.forEach((productDoc) => {
							productsData.push({
								id: productDoc.id,
								...productDoc.data(),
							} as Product);
						});
						categoryData.products = productsData;
						setCategories((prevCategories) =>
							prevCategories.map((cat) =>
								cat.id === categoryData.id ? categoryData : cat
							)
						);
					}
				);
				categoriesData.push(categoryData);
			});
			setCategories(categoriesData);
		});
		return () => unsubscribe();
	}, []);

	const handleSignOut = () => {
		signOut(auth);
	};

	return (
		<div className="w-64 bg-black text-white h-full p-6 overflow-y-auto border-r-2 border-orange-500">
			<h2 className="text-xl font-bold mb-8 text-orange-500 border-b-2 border-orange-500 pb-2">
				Categorías
			</h2>
			<ul className="space-y-4 mb-12">
				{categories.map((category) => (
					<li key={category.id}>
						<div
							className={`cursor-pointer p-3 rounded-md text-lg transition-colors duration-300 ${
								selectedCategory === category.id
									? "bg-orange-500 text-black"
									: "hover:bg-orange-700 hover:text-white"
							}`}
							onClick={() => onSelectCategory(category.id)}
						>
							{category.name}
						</div>
						{selectedCategory === category.id &&
							category.products.length > 0 && (
								<ul className="ml-4 mt-2 space-y-2">
									{category.products.map((product) => (
										<li
											key={product.id}
											className={`cursor-pointer text-md transition-colors duration-300 ${
												selectedProduct && selectedProduct.id === product.id
													? "text-orange-500"
													: "hover:text-orange-700"
											}`}
											onClick={() => onSelectProduct(product)}
										>
											{product.name}
										</li>
									))}
								</ul>
							)}
					</li>
				))}
			</ul>
			<div className="mt-auto space-y-6">
				{user ? (
					<div className="space-y-6">
						<div className="flex items-center justify-between">
							<span className="flex items-center text-lg">
								<FaUser className="mr-3" />
								{user.displayName || user.email}
							</span>
						</div>
						<button
							className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300 w-full"
							onClick={handleSignOut}
						>
							Cerrar Sesión
						</button>
					</div>
				) : (
					<>
						<li className="cursor-pointer p-3 flex items-center text-lg hover:text-orange-500 transition-colors duration-300">
							<FaSignInAlt className="mr-3" />
							<span onClick={() => setShowConfig(true)}>Iniciar Sesión</span>
						</li>
						<li className="cursor-pointer p-3 flex items-center text-lg hover:text-orange-500 transition-colors duration-300">
							<FaUser className="mr-3" />
							<span>Perfil</span>
						</li>
					</>
				)}
				{/* {showConfig && (
					<Configuracion
						onClose={() => setShowConfig(false)}
						onSignIn={function (name: string | null): void {
							throw new Error("Function not implemented.");
						}}
						onSignOut={function (): void {
							throw new Error("Function not implemented.");
						}}
					/>
				)} */}
			</div>
		</div>
	);
};

export default Sidebar;
