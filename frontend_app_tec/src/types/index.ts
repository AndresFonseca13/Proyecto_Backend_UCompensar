export type UserRole = "admin" | "user";

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	rol: UserRole;
}

export interface Brand {
	id: string;
	name: string;
	createAt: string;
}

export interface Author {
	id: string;
	name: string;
	photo: string;
}

export interface Publication {
	id: string;
	name: string;
	description: string;
	img: string;
	price: number;
	brandId: string;
	brand: Brand;
	author: Author;
	likesCount: number;
	commentsCount: number;
	userId: string;
	createAt: string;
}

export interface PublicationWithMeta extends Publication {
	isLikedByMe: boolean;
}

export interface Like {
	id: string;
	userId: string;
	publicationId: string;
	Isliked: boolean;
	createdAt: string;
}

export interface Comment {
	id: string;
	content: string;
	userId: string;
	publicationId: string;
	createdAt: string;
}
