import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Heart, MessageCircle } from "lucide-react";
import type { PublicationWithMeta } from "../types";

interface Props {
	product: PublicationWithMeta;
	onToggleLike?: (id: string) => void;
	href?: string;
}

const ProductCard = ({ product, onToggleLike, href }: Props) => {
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4 }}
			transition={{ duration: 0.3 }}
			onClick={() => navigate(href ?? `/products/${product.id}`)}
			className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
		>
			{/* Imagen */}
			<div className="relative aspect-4/3 bg-gray-100 overflow-hidden">
				<img
					src={product.img}
					alt={product.name}
					className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
				/>
				<motion.button
					onClick={(e) => {
						e.stopPropagation();
						onToggleLike?.(product.id);
					}}
					whileTap={{ scale: 0.8 }}
					className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={product.isLikedByMe ? "liked" : "not-liked"}
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.5, opacity: 0 }}
							transition={{ duration: 0.2 }}
						>
							<Heart
								className={`w-4.5 h-4.5 transition-colors ${
									product.isLikedByMe
										? "fill-red-500 text-red-500"
										: "text-gray-400 hover:text-red-400"
								}`}
							/>
						</motion.div>
					</AnimatePresence>
				</motion.button>
			</div>

			{/* Info */}
			<div className="p-4">
				<p className="text-xs font-semibold text-indigo-600 mb-1">
					{product.brand?.name ?? product.brandId}
				</p>

				<h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1">
					{product.name}
				</h3>
				<p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
					{product.description}
				</p>

				<div className="mt-2 flex items-baseline gap-2">
					<span className="text-lg font-bold text-gray-900">
						${product.price.toLocaleString("es-CO")}
					</span>
				</div>

				{/* Footer: likes y comments */}
				<div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
					<div
						className={`flex items-center gap-1 ${product.isLikedByMe ? "text-red-500" : ""}`}
					>
						<Heart
							className={`w-3.5 h-3.5 ${product.isLikedByMe || product.likesCount > 0 ? "fill-red-400 text-red-400" : ""}`}
						/>
						<span>{product.likesCount}</span>
					</div>
					<div className="flex items-center gap-1">
						<MessageCircle className="w-3.5 h-3.5" />
						<span>{product.commentsCount}</span>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default ProductCard;
