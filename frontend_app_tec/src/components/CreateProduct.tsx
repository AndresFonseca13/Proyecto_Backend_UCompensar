import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
	Package,
	FileText,
	ImageIcon,
	DollarSign,
	Tag,
	ShoppingBag,
	Type,
	ChevronDown,
	Plus,
	CheckCircle,
	X,
} from "lucide-react";
import api from "../services/api";
import Navbar from "./Navbar";
import type { Brand } from "../types";

interface Props {
	userId: string;
	userName: string;
	onLogout: () => void;
}

const CreateProduct = ({ userId, userName, onLogout }: Props) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [toast, setToast] = useState("");

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [img, setImg] = useState("");
	const [price, setPrice] = useState("");
	const [brandId, setBrandId] = useState("");

	const [brands, setBrands] = useState<Brand[]>([]);
	const [loadingBrands, setLoadingBrands] = useState(true);

	useEffect(() => {
		const state = location.state as { brandCreated?: boolean } | null;
		if (state?.brandCreated) {
			setToast("Marca creada exitosamente");
			window.history.replaceState({}, "");
			const timer = setTimeout(() => setToast(""), 4000);
			return () => clearTimeout(timer);
		}
	}, [location.state]);

	useEffect(() => {
		const fetchBrands = async () => {
			try {
				const res = await api.get<Brand[]>("/brand");
				setBrands(res.data);
			} catch (err) {
				console.error("Error fetching brands:", err);
			} finally {
				setLoadingBrands(false);
			}
		};
		fetchBrands();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await api.post("/publication", {
				name,
				description,
				img,
				price: Number(price),
				brandId,
				userId,
			});
			navigate("/catalog", { state: { productCreated: true } });
		} catch (err: unknown) {
			console.error("Error creating product:", err);
			setError(
				"Error al crear el producto. Verifica los datos e intenta de nuevo.",
			);
		} finally {
			setLoading(false);
		}
	};

	const inputClass =
		"w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar userName={userName} onLogout={onLogout} />
			<div className="flex flex-1">
			{/* Panel izquierdo */}
			<div className="hidden lg:flex lg:w-[45%] bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-500 flex-col items-center justify-center p-12 relative overflow-hidden">
				<div className="absolute inset-0 opacity-10">
					<div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
					<div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="relative z-10 text-center"
				>
					<div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
						<ShoppingBag className="w-10 h-10 text-white" />
					</div>
					<h1 className="text-4xl font-bold text-white tracking-tight">
						ShopFlow
					</h1>
					<p className="mt-3 text-indigo-100 text-lg">
						Publica tu producto al mundo
					</p>
				</motion.div>
			</div>

			{/* Panel derecho */}
			<div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white relative">
				{/* Toast */}
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
							className="absolute top-6 left-1/2 -translate-x-1/2 z-50"
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

				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="w-full max-w-md"
				>
					<div className="flex items-center gap-3 mb-2">
						<div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
							<Package className="w-5 h-5 text-indigo-600" />
						</div>
						<h2 className="text-3xl font-bold text-gray-900">
							Nuevo Producto
						</h2>
					</div>
					<p className="mt-1 text-gray-500 mb-8">
						Completa los detalles de tu publicación
					</p>

					<form onSubmit={handleSubmit} className="space-y-4">
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.3 }}
							className="space-y-4"
						>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">
									Nombre del producto
								</label>
								<div className="relative">
									<Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="text"
										required
										placeholder="iPhone 15 Pro"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className={inputClass}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">
									Descripción
								</label>
								<div className="relative">
									<FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
									<textarea
										required
										rows={3}
										placeholder="Describe tu producto..."
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
										className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">
									URL de imagen
								</label>
								<div className="relative">
									<ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="url"
										required
										placeholder="https://ejemplo.com/imagen.jpg"
										value={img}
										onChange={(e) => setImg(e.target.value)}
										className={inputClass}
									/>
								</div>
							</div>

							{img && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									className="rounded-lg overflow-hidden border border-gray-200"
								>
									<img
										src={img}
										alt="Preview"
										className="w-full h-32 object-cover"
										onError={(e) => {
											(
												e.target as HTMLImageElement
											).style.display = "none";
										}}
									/>
								</motion.div>
							)}

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">
									Precio
								</label>
								<div className="relative">
									<DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="number"
										required
										min="1"
										placeholder="4500000"
										value={price}
										onChange={(e) =>
											setPrice(e.target.value)
										}
										className={inputClass}
									/>
								</div>
							</div>

							{/* Brand select */}
							<div>
								<div className="flex items-center justify-between mb-1.5">
									<label className="block text-sm font-medium text-gray-700">
										Marca
									</label>
									<Link
										to="/brands/new"
										className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
									>
										<Plus className="w-3 h-3" />
										Nueva marca
									</Link>
								</div>
								<div className="relative">
									<Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
									<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
									<select
										required
										value={brandId}
										onChange={(e) =>
											setBrandId(e.target.value)
										}
										disabled={loadingBrands}
										className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none disabled:opacity-50"
									>
										<option value="">
											{loadingBrands
												? "Cargando marcas..."
												: "Selecciona una marca"}
										</option>
										{brands.map((brand) => (
											<option
												key={brand.id}
												value={brand.id}
											>
												{brand.name}
											</option>
										))}
									</select>
								</div>
							</div>
						</motion.div>

						{error && (
							<motion.p
								initial={{ opacity: 0, y: -5 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-lg"
							>
								{error}
							</motion.p>
						)}

						<motion.button
							type="submit"
							disabled={loading}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.98 }}
							className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? "Publicando..." : "Publicar Producto"}
						</motion.button>
					</form>
				</motion.div>
			</div>
			</div>
		</div>
	);
};

export default CreateProduct;
