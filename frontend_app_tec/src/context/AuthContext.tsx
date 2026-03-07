import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types";

interface LoginResponse {
	access_token: string;
	user: AuthUser;
}

interface AuthContextType {
	user: AuthUser | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
	login: (data: LoginResponse) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadUser(): AuthUser | null {
	try {
		const raw = localStorage.getItem("auth_user");
		if (!raw) return null;
		return JSON.parse(raw) as AuthUser;
	} catch {
		return null;
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<AuthUser | null>(loadUser);

	const isAuthenticated = user !== null;
	const isAdmin = user?.rol === "admin";

	const login = useCallback((data: LoginResponse) => {
		localStorage.setItem("access_token", data.access_token);
		localStorage.setItem("auth_user", JSON.stringify(data.user));
		setUser(data.user);
	}, []);

	const logout = useCallback(() => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("auth_user");
		setUser(null);
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, isAdmin, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
