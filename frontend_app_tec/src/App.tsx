import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import CreateProduct from "./components/CreateProduct";
import CreateBrand from "./components/CreateBrand";
import ProductCatalog from "./pages/ProductCatalog";
import ProductDetail from "./pages/ProductDetail";
import MyProducts from "./pages/MyProducts";
import EditProduct from "./pages/EditProduct";

function App() {
	const { isAuthenticated, isAdmin } = useAuth();

	return (
		<Routes>
			<Route
				path="/"
				element={
					isAuthenticated ? (
						<Navigate to="/catalog" replace />
					) : (
						<Login />
					)
				}
			/>
			<Route
				path="/catalog"
				element={
					isAuthenticated ? (
						<ProductCatalog />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
			<Route
				path="/products/new"
				element={
					!isAuthenticated ? (
						<Navigate to="/" replace />
					) : !isAdmin ? (
						<Navigate to="/catalog" replace />
					) : (
						<CreateProduct />
					)
				}
			/>
			<Route
				path="/brands/new"
				element={
					!isAuthenticated ? (
						<Navigate to="/" replace />
					) : !isAdmin ? (
						<Navigate to="/catalog" replace />
					) : (
						<CreateBrand />
					)
				}
			/>
			<Route
				path="/my-products"
				element={
					!isAuthenticated ? (
						<Navigate to="/" replace />
					) : !isAdmin ? (
						<Navigate to="/catalog" replace />
					) : (
						<MyProducts />
					)
				}
			/>
			<Route
				path="/products/:id/edit"
				element={
					!isAuthenticated ? (
						<Navigate to="/" replace />
					) : !isAdmin ? (
						<Navigate to="/catalog" replace />
					) : (
						<EditProduct />
					)
				}
			/>
			<Route
				path="/products/:id"
				element={
					isAuthenticated ? (
						<ProductDetail />
					) : (
						<Navigate to="/" replace />
					)
				}
			/>
		</Routes>
	);
}

export default App;
