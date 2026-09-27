import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Package } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { user } = useSelector((state) => state.auth);

  const canModify = user?.role === 'admin';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors flex flex-col">
      <div className="relative aspect-square bg-zinc-950 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
            <Package className="w-8 h-8 stroke-1" />
            <span className="text-[11px] mt-1">No image</span>
          </div>
        )}

        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-medium px-2 py-0.5 rounded ${
            product.stock > 0
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/products/${product._id}`}>
            <h3 className="font-medium text-zinc-100 text-sm hover:text-white line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-sm font-semibold text-white">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          {canModify && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(product)}
                className="p-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(product._id)}
                className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-md transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
