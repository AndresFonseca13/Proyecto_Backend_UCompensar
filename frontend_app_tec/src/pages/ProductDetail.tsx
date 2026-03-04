import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
	Heart,
	Share2,
	MessageCircle,
	Send,
	ChevronRight,
	Loader2,
	ArrowLeft,
} from "lucide-react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import type { Publication, Like, Comment } from "../types";

interface Props {
	userId: string;
	userName: string;
	onLogout: () => void;
}

interface CommentWithUser extends Comment {
	userName?: string;
	userPhoto?: string;
}

const ProductDetail = ({ userId, userName, onLogout }: Props) => {
	const { id } = useParams<{ id: string }>();
	const [product, setProduct] = useState<Publication | null>(null);
	const [likes, setLikes] = useState<Like[]>([]);
	const [comments, setComments] = useState<CommentWithUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [newComment, setNewComment] = useState("");
	const [posting, setPosting] = useState(false);

	const activeLikes = likes.filter((l) => l.Isliked);
	const isLikedByMe = activeLikes.some((l) => l.userId === userId);

	const fetchData = useCallback(async () => {
		if (!id) return;
		try {
			const [pubRes, likesRes, commentsRes] = await Promise.all([
				api.get<Publication>(`/publication/${id}`),
				api
					.get<Like[]>(`/like?publicationId=${id}`)
					.catch(() => ({ data: [] as Like[] })),
				api
					.get<Comment[]>(`/comment?publicationId=${id}`)
					.catch(() => ({ data: [] as Comment[] })),
			]);
			setProduct(pubRes.data);
			setLikes(likesRes.data);

			const enrichedComments: CommentWithUser[] = await Promise.all(
				commentsRes.data.map(async (c) => {
					try {
						const userRes = await api.get(`/users/${c.userId}`);
						return {
							...c,
							userName: userRes.data.name,
							userPhoto: userRes.data.photo,
						};
					} catch {
						return { ...c, userName: "Usuario" };
					}
				}),
			);
			setComments(enrichedComments);
		} catch (err) {
			console.error("Error loading product:", err);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const handleToggleLike = async () => {
		if (!id) return;
		try {
			const { data: allLikes } = await api
				.get<Like[]>(`/like?publicationId=${id}`)
				.catch(() => ({ data: [] as Like[] }));
			const myLike = allLikes.find((l) => l.userId === userId);

			if (isLikedByMe) {
				if (myLike) {
					await api.patch(`/like/${myLike.id}`, { Isliked: false });
				}
			} else if (myLike) {
				await api.patch(`/like/${myLike.id}`, { Isliked: true });
			} else {
				await api.post("/like", {
					userId,
					publicationId: id,
					Isliked: true,
				});
			}

			const res = await api
				.get<Like[]>(`/like?publicationId=${id}`)
				.catch(() => ({ data: [] as Like[] }));
			setLikes(res.data);
		} catch (err) {
			console.error("Error toggling like:", err);
		}
	};

	const handlePostComment = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim() || !id) return;
		setPosting(true);
		try {
			await api.post("/comment", {
				content: newComment.trim(),
				userId,
				publicationId: id,
			});
			setNewComment("");
			const res = await api
				.get<Comment[]>(`/comment?publicationId=${id}`)
				.catch(() => ({ data: [] as Comment[] }));
			const enriched: CommentWithUser[] = await Promise.all(
				res.data.map(async (c) => {
					try {
						const userRes = await api.get(`/users/${c.userId}`);
						return {
							...c,
							userName: userRes.data.name,
							userPhoto: userRes.data.photo,
						};
					} catch {
						return { ...c, userName: "Usuario" };
					}
				}),
			);
			setComments(enriched);
		} catch (err) {
			console.error("Error posting comment:", err);
		} finally {
			setPosting(false);
		}
	};

	const timeAgo = (dateStr: string) => {
		const diff = Date.now() - new Date(dateStr).getTime();
		const mins = Math.floor(diff / 60000);
		if (mins < 1) return "Ahora mismo";
		if (mins < 60) return `hace ${mins} min`;
		const hours = Math.floor(mins / 60);
		if (hours < 24) return `hace ${hours}h`;
		const days = Math.floor(hours / 24);
		return `hace ${days}d`;
	};

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((w) => w[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar userName={userName} onLogout={onLogout} />
				<div className="flex items-center justify-center py-32">
					<Loader2 className="w-8 h-8 animate-spin text-gray-400" />
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Navbar userName={userName} onLogout={onLogout} />
				<div className="max-w-7xl mx-auto px-4 py-16 text-center">
					<p className="text-gray-500 text-lg">Producto no encontrado</p>
					<Link
						to="/catalog"
						className="mt-4 inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 font-medium"
					>
						<ArrowLeft className="w-4 h-4" />
						Volver al catálogo
					</Link>
				</div>
			</div>
		);
	}

	const brandName = product.brand?.name ?? product.brandId;

	return (
		<div className="min-h-screen bg-gray-50">
			<Navbar userName={userName} onLogout={onLogout} />

			{/* Breadcrumb */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
				<nav className="flex items-center gap-1.5 text-sm text-gray-500">
					<Link
						to="/catalog"
						className="hover:text-indigo-600 transition-colors"
					>
						Catálogo
					</Link>
					<ChevronRight className="w-3.5 h-3.5" />
					<span className="text-gray-400">{brandName}</span>
					<ChevronRight className="w-3.5 h-3.5" />
					<span className="text-gray-900 font-medium truncate max-w-xs">
						{product.name}
					</span>
				</nav>
			</div>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
					{/* Imagen */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-square"
					>
						<img
							src={product.img}
							alt={product.name}
							className="w-full h-full object-cover"
						/>
						<span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
							Nuevo
						</span>
					</motion.div>

					{/* Info */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="flex flex-col justify-center"
					>
						<p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">
							{brandName}
						</p>

						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
							{product.name}
						</h1>

						<p className="mt-4 text-gray-500 leading-relaxed">
							{product.description}
						</p>

						{/* Author */}
						{product.author && (
							<div className="mt-4 flex items-center gap-2.5">
								{product.author.photo ? (
									<img
										src={product.author.photo}
										alt={product.author.name}
										className="w-8 h-8 rounded-full object-cover"
									/>
								) : (
									<div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-xs font-semibold">
										{getInitials(product.author.name)}
									</div>
								)}
								<span className="text-sm text-gray-500">
									Publicado por{" "}
									<span className="font-medium text-gray-700">
										{product.author.name}
									</span>
								</span>
							</div>
						)}

						<p className="mt-3 text-sm text-gray-400">
							{new Date(product.createAt).toLocaleDateString(
								"es-CO",
								{
									year: "numeric",
									month: "long",
									day: "numeric",
								},
							)}
						</p>

						{/* Precio */}
						<div className="mt-6">
							<span className="text-3xl font-bold text-gray-900">
								${product.price.toLocaleString("es-CO")}
							</span>
						</div>

						{/* Acciones */}
						<div className="mt-8 flex items-center gap-3">
							<motion.button
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
								onClick={handleToggleLike}
								className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
									isLikedByMe
										? "bg-red-50 text-red-600 border border-red-200"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								}`}
							>
								<Heart
									className={`w-4 h-4 ${isLikedByMe ? "fill-red-500 text-red-500" : ""}`}
								/>
								{activeLikes.length} Likes
							</motion.button>

							<button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
								<Share2 className="w-4 h-4" />
								Compartir
							</button>
						</div>
					</motion.div>
				</div>

				{/* Comments Section */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
							<MessageCircle className="w-5 h-5" />
							Comentarios ({comments.length})
						</h2>
					</div>

					<form
						onSubmit={handlePostComment}
						className="bg-white rounded-2xl p-5 shadow-sm mb-6"
					>
						<div className="flex gap-3">
							<div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
								{getInitials(userName)}
							</div>
							<textarea
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								placeholder="Escribe un comentario..."
								rows={2}
								className="flex-1 resize-none text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
							/>
						</div>
						<div className="flex justify-end mt-3">
							<motion.button
								type="submit"
								disabled={posting || !newComment.trim()}
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								<Send className="w-4 h-4" />
								{posting ? "Enviando..." : "Comentar"}
							</motion.button>
						</div>
					</form>

					<div className="space-y-4">
						<AnimatePresence>
							{comments.length === 0 ? (
								<p className="text-center text-gray-400 py-8 text-sm">
									Aún no hay comentarios. ¡Sé el primero!
								</p>
							) : (
								comments.map((comment, i) => (
									<motion.div
										key={comment.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{
											duration: 0.3,
											delay: i * 0.05,
										}}
										className="bg-white rounded-2xl p-5 shadow-sm"
									>
										<div className="flex items-start gap-3">
											{comment.userPhoto ? (
												<img
													src={comment.userPhoto}
													alt={comment.userName ?? ""}
													className="w-10 h-10 rounded-full object-cover shrink-0"
												/>
											) : (
												<div className="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold shrink-0">
													{getInitials(
														comment.userName ?? "U",
													)}
												</div>
											)}
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="text-sm font-semibold text-gray-900">
														{comment.userName ??
															"Usuario"}
													</span>
													<span className="text-xs text-gray-400">
														{timeAgo(
															comment.createdAt,
														)}
													</span>
												</div>
												<p className="mt-1.5 text-sm text-gray-600 leading-relaxed">
													{comment.content}
												</p>
											</div>
										</div>
									</motion.div>
								))
							)}
						</AnimatePresence>
					</div>
				</motion.section>
			</main>
		</div>
	);
};

export default ProductDetail;
