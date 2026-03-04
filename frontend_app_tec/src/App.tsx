import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import CreateProduct from "./components/CreateProduct";
import CreateBrand from "./components/CreateBrand";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(
		() => !!localStorage.getItem("access_token"),
	);

	const parseToken = () => {
		const token = localStorage.getItem("access_token");
		if (!token) return { userId: "", userName: "" };
		try {
			const payload = JSON.parse(atob(token.split(".")[1]));
			return {
				userId: (payload.sub as string) ?? "",
				userName: (payload.name as string) ?? "",
			};
		} catch {
			return { userId: "", userName: "" };
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		setIsAuthenticated(false);
	};

	const { userId, userName } = parseToken();

	return (
		<Routes>
			<Route
				path="/"
				element={
					isAuthenticated ? (
						<Navigate to="/catalog" replace />
					) : (
						<Login onLoginSuccess={() => setIsAuthenticated(true)} />
					)
				}
			/>
			<Route
				path="/catalog"
				element={
					isAuthenticated ? (
						<ProductCatalog
							userId={userId}
							userName={userName}
							onLogout={handleLogout}
						/>
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/products/new"
				element={
					isAuthenticated ? (
						<CreateProduct userId={userId} userName={userName} onLogout={handleLogout} />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/brands/new"
				element={
					isAuthenticated ? (
						<CreateBrand userName={userName} onLogout={handleLogout} />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/my-products"
				element={
					isAuthenticated ? (
						<MyProducts
							userId={userId}
							userName={userName}
							onLogout={handleLogout}
						/>
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/products/:id/edit"
				element={
					isAuthenticated ? (
						<EditProduct userName={userName} onLogout={handleLogout} />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/products/:id"
				element={
					isAuthenticated ? (
						<ProductDetail
							userId={userId}
							userName={userName}
							onLogout={handleLogout}
						/>
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
		</Routes>
	);
}

export default App;
