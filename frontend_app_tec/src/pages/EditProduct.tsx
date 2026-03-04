import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
	Package,
	FileText,
	ImageIcon,
	DollarSign,
	Tag,
	Type,
	ShoppingBag,
	Trash2,
	ArrowLeft,
	Loader2,
	X,
	AlertTriangle,
} from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import type { Publication, Brand } from "../types";

interface Props {
	userName: string;
	onLogout: () => void;
}

const EditProduct = ({ userName, onLogout }: Props) => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const [product, setProduct] = useState<Publication | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const [error, setError] = useState("");
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [img, setImg] = useState("");
	const [price, setPrice] = useState("");
	const [brandId, setBrandId] = useState("");

	const [brands, setBrands] = useState<Brand[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			if (!id) return;
			try {
				const [pubRes, brandsRes] = await Promise.all([
					api.get<Publication>(`/publication/${id}`),
					api
						.get<Brand[]>("/brand")
						.catch(() => ({ data: [] as Brand[] })),
				]);
				const p = pubRes.data;
				setProduct(p);
				setName(p.name);
				setDescription(p.description);
				setImg(p.img);
				setPrice(String(p.price));
				setBrandId(p.brandId);
				setBrands(brandsRes.data);
			} catch (err) {
				console.error("Error loading product:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id || !product) return;
		setSaving(true);
		setError("");

		const patch: Record<string, unknown> = {};
		if (name !== product.name) patch.name = name;
		if (description !== product.description)
			patch.description = description;
		if (img !== product.img) patch.img = img;
		if (Number(price) !== product.price) patch.price = Number(price);
		if (brandId !== product.brandId) patch.brandId = brandId;

		if (Object.keys(patch).length === 0) {
			navigate("/my-products");
			return;
		}

		try {
			await api.patch(`/publication/${id}`, patch);
			navigate("/my-products", { state: { productUpdated: true } });
		} catch (err: unknown) {
			console.error("Error updating product:", err);
			setError(
				"Error al actualizar el producto. Intenta de nuevo.",
			);
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		setDeleting(true);
		try {
			await api.delete(`/publication/${id}`);
			navigate("/my-products", { state: { productDeleted: true } });
		} catch (err: unknown) {
			console.error("Error deleting product:", err);
			setError("Error al eliminar el producto.");
			setShowDeleteModal(false);
		} finally {
			setDeleting(false);
		}
	};

	const inputClass =
		"w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<Loader2 className="w-8 h-8 animate-spin text-gray-400" />
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<p className="text-gray-500 text-lg">
						Producto no encontrado
					</p>
					<Link
						to="/my-products"
						className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium"
					>
						<ArrowLeft className="w-4 h-4" />
						Volver a mis productos
					</Link>
				</div>
			</div>
		);
	}

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
						Edita tu publicación
					</p>
				</motion.div>
			</div>

			{/* Panel derecho */}
			<div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="w-full max-w-md"
				>
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
								<Package className="w-5 h-5 text-indigo-600" />
							</div>
							<h2 className="text-3xl font-bold text-gray-900">
								Editar Producto
							</h2>
						</div>
						<button
							onClick={() => setShowDeleteModal(true)}
							className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
							title="Eliminar producto"
						>
							<Trash2 className="w-5 h-5" />
						</button>
					</div>
					<p className="mt-1 text-gray-500 mb-8">
						Modifica los campos que desees
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
										value={name}
										onChange={(e) =>
											setName(e.target.value)
										}
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
										value={description}
										onChange={(e) =>
											setDescription(e.target.value)
										}
										className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
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
										value={img}
										onChange={(e) =>
											setImg(e.target.value)
										}
										className={inputClass}
									/>
								</div>
							</div>

							{img && (
								<div className="rounded-lg overflow-hidden border border-gray-200">
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
								</div>
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
										value={price}
										onChange={(e) =>
											setPrice(e.target.value)
										}
										className={inputClass}
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1.5">
									Marca
								</label>
								<div className="relative">
									<Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
									<select
										required
										value={brandId}
										onChange={(e) =>
											setBrandId(e.target.value)
										}
										className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all appearance-none"
									>
										<option value="">
											Selecciona una marca
										</option>
										{brands.map((b) => (
											<option key={b.id} value={b.id}>
												{b.name}
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

						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => navigate("/my-products")}
								className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
							>
								Cancelar
							</button>
							<motion.button
								type="submit"
								disabled={saving}
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.98 }}
								className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{saving ? "Guardando..." : "Guardar Cambios"}
							</motion.button>
						</div>
					</form>
				</motion.div>
			</div>

			{/* Delete Confirmation Modal */}
			<AnimatePresence>
				{showDeleteModal && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
						onClick={() => setShowDeleteModal(false)}
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ duration: 0.2 }}
							onClick={(e) => e.stopPropagation()}
							className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
						>
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
									<AlertTriangle className="w-5 h-5 text-red-600" />
								</div>
								<h3 className="text-lg font-bold text-gray-900">
									Eliminar producto
								</h3>
								<button
									onClick={() => setShowDeleteModal(false)}
									className="ml-auto text-gray-400 hover:text-gray-600"
								>
									<X className="w-5 h-5" />
								</button>
							</div>
							<p className="text-sm text-gray-600 mb-6">
								¿Estás seguro de que quieres eliminar{" "}
								<span className="font-semibold">
									{product.name}
								</span>
								? Esta acción no se puede deshacer.
							</p>
							<div className="flex gap-3">
								<button
									onClick={() => setShowDeleteModal(false)}
									className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
								>
									Cancelar
								</button>
								<button
									onClick={handleDelete}
									disabled={deleting}
									className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
								>
									{deleting ? "Eliminando..." : "Eliminar"}
								</button>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
			</div>
		</div>
	);
};

export default EditProduct;
