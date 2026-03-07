import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, Loader2, PackageX, CheckCircle, X } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import type { Publication, PublicationWithMeta, Brand } from "../types";

const ProductCatalog = () => {
	const location = useLocation();
	const { user } = useAuth();
	const userId = user?.id ?? "";

	const [products, setProducts] = useState<PublicationWithMeta[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [selectedBrand, setSelectedBrand] = useState("all");
	const [brands, setBrands] = useState<Brand[]>([]);
	const [toast, setToast] = useState("");

	useEffect(() => {
		const state = location.state as { productCreated?: boolean } | null;
		if (state?.productCreated) {
			setToast("Producto publicado exitosamente");
			window.history.replaceState({}, "");
			const timer = setTimeout(() => setToast(""), 4000);
			return () => clearTimeout(timer);
		}
	}, [location.state]);

	const fetchProducts = useCallback(async () => {
		try {
			const [pubRes, brandsRes] = await Promise.all([
				api.get<Publication[]>("/publication"),
				api.get<Brand[]>("/brand").catch(() => ({ data: [] as Brand[] })),
			]);

			const enriched: PublicationWithMeta[] = pubRes.data.map((pub) => ({
				...pub,
				isLikedByMe: false,
			}));

			setProducts(enriched);
			setBrands(brandsRes.data);
		} catch (err) {
			console.error("Error fetching products:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProducts();
	}, [fetchProducts]);

	const handleToggleLike = async (publicationId: string) => {
		const product = products.find((p) => p.id === publicationId);
		if (!product) return;

		setProducts((prev) =>
			prev.map((p) =>
				p.id === publicationId
					? {
							...p,
							isLikedByMe: !p.isLikedByMe,
							likesCount: p.isLikedByMe
								? p.likesCount - 1
								: p.likesCount + 1,
						}
					: p,
			),
		);

		try {
			await api.post("/like/toggle", { userId, publicationId });
		} catch (err) {
			console.error("Error toggling like:", err);
			setProducts((prev) =>
				prev.map((p) =>
					p.id === publicationId
						? {
								...p,
								isLikedByMe: product.isLikedByMe,
								likesCount: product.likesCount,
							}
						: p,
				),
			);
		}
	};

	const filtered = products.filter((p) => {
		const term = search.toLowerCase();
		const matchesSearch =
			p.name.toLowerCase().includes(term) ||
			p.description.toLowerCase().includes(term);
		const matchesBrand =
			selectedBrand === "all" || p.brand?.id === selectedBrand;
		return matchesSearch && matchesBrand;
	});

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar />

			<AnimatePresence>
				{toast && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ type: "spring", stiffness: 400, damping: 25 }}
						className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
					>
						<div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-lg border border-emerald-100">
							<CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
							<span className="text-sm font-medium text-gray-800">
								{toast}
							</span>
							<button
								onClick={() => setToast("")}
								className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
							>
								<X className="w-4 h-4" />
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900">
							Catálogo de Productos
						</h1>
						<p className="mt-1 text-gray-500">
							Descubre nuestra colección
						</p>
					</div>
					<div className="relative w-full sm:w-72">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="text"
							placeholder="Buscar productos..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
						/>
					</div>
				</div>

				{brands.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-8">
						<button
							onClick={() => setSelectedBrand("all")}
							className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
								selectedBrand === "all"
									? "bg-indigo-600 text-white shadow-sm"
									: "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
							}`}
						>
							Todos
						</button>
						{brands.map((brand) => (
							<button
								key={brand.id}
								onClick={() => setSelectedBrand(brand.id)}
								className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
									selectedBrand === brand.id
										? "bg-indigo-600 text-white shadow-sm"
										: "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
								}`}
							>
								{brand.name}
							</button>
						))}
					</div>
				)}

				{loading ? (
					<div className="flex flex-col items-center justify-center py-32 text-gray-400">
						<Loader2 className="w-8 h-8 animate-spin mb-3" />
						<p className="text-sm">Cargando productos...</p>
					</div>
				) : filtered.length === 0 ? (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="flex flex-col items-center justify-center py-32 text-gray-400"
					>
						<PackageX className="w-12 h-12 mb-3" />
						<p className="text-lg font-medium text-gray-500">
							No se encontraron productos
						</p>
						<p className="text-sm mt-1">
							Intenta con otro filtro o término de búsqueda
						</p>
					</motion.div>
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key={selectedBrand + search}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{filtered.map((product, i) => (
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
										onToggleLike={handleToggleLike}
									/>
								</motion.div>
							))}
						</motion.div>
					</AnimatePresence>
				)}
			</main>
		</div>
	);
};

export default ProductCatalog;
