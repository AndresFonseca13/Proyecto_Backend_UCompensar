import { NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
	const navigate = useNavigate();
	const { user, isAdmin, logout } = useAuth();

	const initials = user?.name
		? user.name
				.split(" ")
				.map((w) => w[0])
				.join("")
				.toUpperCase()
				.slice(0, 2)
		: "U";

	const linkClass = ({ isActive }: { isActive: boolean }) =>
		`text-sm font-medium transition-colors ${
			isActive
				? "text-indigo-600"
				: "text-gray-600 hover:text-gray-900"
		}`;

	return (
		<nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<button
						onClick={() => navigate("/catalog")}
						className="flex items-center gap-2"
					>
						<div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
							<ShoppingBag className="w-4 h-4 text-white" />
						</div>
						<span className="text-lg font-bold text-gray-900 tracking-tight">
							ShopFlow
						</span>
					</button>

					{/* Links */}
					<div className="hidden sm:flex items-center gap-8">
						<NavLink to="/catalog" className={linkClass}>
							Catálogo
						</NavLink>
						{isAdmin && (
							<NavLink to="/brands/new" className={linkClass}>
								Marcas
							</NavLink>
						)}
					</div>

					{/* Right side */}
					<div className="flex items-center gap-4">
						<button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
							<Search className="w-5 h-5" />
						</button>

						{/* Role badge */}
						<div
							className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
								isAdmin
									? "bg-amber-50 text-amber-700 border border-amber-200"
									: "bg-gray-100 text-gray-600 border border-gray-200"
							}`}
						>
							{isAdmin && <Shield className="w-3 h-3" />}
							{isAdmin ? "Admin" : "Usuario"}
						</div>

						<div className="relative group">
							<button className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
								{initials}
							</button>
							<div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2">
								{isAdmin && (
									<>
										<button
											onClick={() => navigate("/my-products")}
											className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
										>
											Mis Productos
										</button>
										<button
											onClick={() => navigate("/products/new")}
											className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
										>
											Publicar Producto
										</button>
										<div className="my-1 border-t border-gray-100" />
									</>
								)}
								<button
									onClick={logout}
									className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
								>
									Cerrar Sesión
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
