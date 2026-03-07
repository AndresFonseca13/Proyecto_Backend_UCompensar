import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
	Mail,
	Lock,
	Eye,
	EyeOff,
	ShoppingBag,
	User,
	MapPin,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "register";

const Login = () => {
	const { login } = useAuth();
	const [mode, setMode] = useState<AuthMode>("login");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [city, setCity] = useState("");

	const resetForm = () => {
		setEmail("");
		setPassword("");
		setName("");
		setCity("");
		setError("");
	};

	const switchMode = (newMode: AuthMode) => {
		if (newMode === mode) return;
		resetForm();
		setMode(newMode);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			if (mode === "register") {
				await api.post("/users", { email, name, password, rol: "user", city });
			}
			const res = await api.post("/auth/login", { email, password });
			login(res.data);
		} catch (err: unknown) {
			console.error("Auth error:", err);
			setError(
				mode === "login"
					? "Credenciales incorrectas o error en el servidor"
					: "Error al registrar. Verifica los datos e intenta de nuevo",
			);
		} finally {
			setLoading(false);
		}
	};

	const inputClass =
		"w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all";

	return (
		<div className="min-h-screen flex">
			{/* Panel izquierdo */}
			<div className="hidden lg:flex lg:w-[45%] bg-indigo-500 flex-col items-center justify-center p-12 relative overflow-hidden">
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
						Tu experiencia de compra moderna
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
					<AnimatePresence mode="wait">
						<motion.div
							key={mode}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.25 }}
						>
							<h2 className="text-3xl font-bold text-gray-900">
								{mode === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}
							</h2>
							<p className="mt-2 text-gray-500">
								{mode === "login"
									? "Inicia sesión en tu cuenta para continuar"
									: "Regístrate para empezar a explorar"}
							</p>
						</motion.div>
					</AnimatePresence>

					{/* Toggle */}
					<div className="mt-8 flex bg-gray-100 rounded-xl p-1 relative">
						{(["login", "register"] as const).map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => switchMode(tab)}
								className={`relative z-10 flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
									mode === tab ? "text-gray-900" : "text-gray-500"
								}`}
							>
								{tab === "login" ? "Login" : "Register"}
							</button>
						))}
						<motion.div
							className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
							animate={{ x: mode === "login" ? 4 : "calc(100% + 4px)" }}
							transition={{ type: "spring", stiffness: 400, damping: 30 }}
						/>
					</div>

					{/* Formulario */}
					<form onSubmit={handleSubmit} className="mt-8 space-y-5">
						<AnimatePresence mode="wait">
							<motion.div
								key={mode}
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -15 }}
								transition={{ duration: 0.3 }}
								className="space-y-4"
							>
								{mode === "register" && (
									<>
										<div className="relative">
											<User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												type="text"
												required
												placeholder="Nombre completo"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className={inputClass}
											/>
										</div>
										<div className="relative">
											<MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
											<input
												type="text"
												placeholder="Ciudad (opcional)"
												value={city}
												onChange={(e) => setCity(e.target.value)}
												className={inputClass}
											/>
										</div>
									</>
								)}

								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type="email"
										required
										placeholder="you@example.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className={inputClass}
									/>
								</div>

								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										type={showPassword ? "text" : "password"}
										required
										placeholder="Ingresa tu contraseña"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className={`${inputClass} pr-10`}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
									>
										{showPassword ? (
											<EyeOff className="w-4 h-4" />
										) : (
											<Eye className="w-4 h-4" />
										)}
									</button>
								</div>
							</motion.div>
						</AnimatePresence>

						{mode === "login" && (
							<div className="text-right">
								<button
									type="button"
									className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
								>
									¿Olvidaste tu contraseña?
								</button>
							</div>
						)}

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
							{loading
								? "Procesando..."
								: mode === "login"
									? "Iniciar Sesión"
									: "Crear Cuenta"}
						</motion.button>
					</form>
				</motion.div>
			</div>
		</div>
	);
};

export default Login;
