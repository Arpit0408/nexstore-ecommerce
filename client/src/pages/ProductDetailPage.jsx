import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance.js";
import toast from "react-hot-toast";
import { ArrowLeft, Package, Loader2, ShieldCheck, Truck } from "lucide-react";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to products</span>
      </Link>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
        {/* Product Image */}
        <div className="aspect-square bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-zinc-800">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-zinc-700 flex flex-col items-center">
              <Package className="w-12 h-12 stroke-1" />
              <span className="text-xs mt-2">No image available</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span
                className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded mb-2 ${
                  product.stock > 0
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} units available`
                  : "Out of stock"}
              </span>
              <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                {product.title}
              </h1>
            </div>

            <div className="text-2xl font-bold text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="pt-6 border-t border-zinc-800/80 space-y-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-zinc-500" />
              <span>Fast & secure doorstep delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-500" />
              <span>100% Genuine product guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
