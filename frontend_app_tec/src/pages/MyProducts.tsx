import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, PackageX, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import type { Publication, PublicationWithMeta } from "../types";

interface Props {
	userId: string;
	userName: string;
	onLogout: () => void;
}

const MyProducts = ({ userId, userName, onLogout }: Props) => {
	const location = useLocation();
	const [products, setProducts] = useState<PublicationWithMeta[]>([]);
	const [loading, setLoading] = useState(true);
	const [toast, setToast] = useState("");

	useEffect(() => {
		const state = location.state as {
			productUpdated?: boolean;
			productDeleted?: boolean;
		} | null;
		if (state?.productUpdated) {
			setToast("Producto actualizado exitosamente");
		} else if (state?.productDeleted) {
			setToast("Producto eliminado exitosamente");
		}
		if (state?.productUpdated || state?.productDeleted) {
			window.history.replaceState({}, "");
			const timer = setTimeout(() => setToast(""), 4000);
			return () => clearTimeout(timer);
		}
	}, [location.state]);

	const fetchMyProducts = useCallback(async () => {
		try {
			const { data } = await api.get<Publication[]>(
				`/publication?userId=${userId}`,
			);
			setProducts(data.map((p) => ({ ...p, isLikedByMe: false })));
		} catch (err) {
			console.error("Error fetching my products:", err);
		} finally {
			setLoading(false);
		}
	}, [userId]);

	useEffect(() => {
		fetchMyProducts();
	}, [fetchMyProducts]);

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar userName={userName} onLogout={onLogout} />

			<AnimatePresence>
				{toast && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 25,
						}}
						className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
					>
						<div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-lg border border-emerald-100">
							<span className="text-sm font-medium text-gray-800">
								{toast}
							</span>
							<button
								onClick={() => setToast("")}
								className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								<span className="sr-only">Cerrar</span>
								&times;
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Mis Productos
						</h1>
						<p className="mt-1 text-gray-500">
							Gestiona tus publicaciones
						</p>
					</div>
					<Link
						to="/products/new"
						className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
					>
						<Plus className="w-4 h-4" />
						Nuevo Producto
					</Link>
				</div>

				{loading ? (
					<div className="flex flex-col items-center justify-center py-32 text-gray-400">
						<Loader2 className="w-8 h-8 animate-spin mb-3" />
						<p className="text-sm">Cargando tus productos...</p>
					</div>
				) : products.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex flex-col items-center justify-center py-32 text-gray-400"
					>
						<PackageX className="w-12 h-12 mb-3" />
						<p className="text-lg font-medium text-gray-500">
							Aún no has publicado productos
						</p>
						<Link
							to="/products/new"
							className="mt-4 text-indigo-600 hover:text-indigo-500 text-sm font-medium"
						>
							Publica tu primer producto
						</Link>
					</motion.div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{products.map((product, i) => (
							<motion.div
								key={product.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.3,
									delay: i * 0.05,
								}}
							>
								<ProductCard
									product={product}
									href={`/products/${product.id}/edit`}
								/>
							</motion.div>
						))}
					</div>
				)}
			</main>
		</div>
	);
};

export default MyProducts;
