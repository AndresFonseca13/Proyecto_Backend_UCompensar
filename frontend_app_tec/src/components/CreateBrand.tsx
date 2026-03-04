import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Tag, ShoppingBag } from "lucide-react";
import api from "../services/api";
import Navbar from "./Navbar";

interface Props {
	userName: string;
	onLogout: () => void;
}

const CreateBrand = ({ userName, onLogout }: Props) => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await api.post("/brand", { name });
			navigate("/products/new", { state: { brandCreated: true } });
		} catch (err: unknown) {
			console.error("Error creating brand:", err);
			setError(
				"Error al crear la marca. Verifica que no exista ya e intenta de nuevo.",
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
						Gestiona tus marcas
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
					<div className="flex items-center gap-3 mb-2">
						<div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
							<Tag className="w-5 h-5 text-indigo-600" />
						</div>
						<h2 className="text-3xl font-bold text-gray-900">
							Nueva Marca
						</h2>
					</div>
					<p className="mt-1 text-gray-500 mb-8">
						Crea una marca para asignar a tus productos
					</p>

					<form onSubmit={handleSubmit} className="space-y-5">
						<motion.div
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: 0.3 }}
						>
							<label className="block text-sm font-medium text-gray-700 mb-1.5">
								Nombre de la marca
							</label>
							<div className="relative">
								<Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
								<input
									type="text"
									required
									placeholder="Apple, Samsung, Sony..."
									value={name}
									onChange={(e) => setName(e.target.value)}
									className={inputClass}
								/>
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
							{loading ? "Creando..." : "Crear Marca"}
						</motion.button>
					</form>
				</motion.div>
			</div>
			</div>
		</div>
	);
};

export default CreateBrand;
