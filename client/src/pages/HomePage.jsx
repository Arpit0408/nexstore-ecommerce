import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProducts, setLoading, setError } from "../redux/productSlice.js";
import axiosInstance from "../api/axiosInstance.js";
import ProductCard from "../components/ProductCard.jsx";
import ProductModal from "../components/ProductModal.jsx";
import DeleteConfirmModal from "../components/DeleteConfirmModal.jsx";
import toast from "react-hot-toast";
import { Search, Plus, PackageOpen, Loader2 } from "lucide-react";

const HomePage = () => {
  const { items: products, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm;

      const response = await axiosInstance.get("/products", { params });
      dispatch(setProducts(response.data.products));
    } catch (err) {
      dispatch(setError(err.message));
      toast.error("Failed to load products");
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id) => {
    setDeleteProductId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductId) return;
    setDeleteLoading(true);

    try {
      await axiosInstance.delete(`/products/${deleteProductId}`);
      toast.success("Product deleted");
      setIsDeleteOpen(false);
      setDeleteProductId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors"
          />
        </div>

        {/* Only Visible to Admins */}
        {user?.role === "admin" && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-1.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400 mb-2" />
          <p className="text-xs">Loading products...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-800 rounded-xl">
          <PackageOpen className="w-10 h-10 text-zinc-600 mb-2 stroke-1" />
          <h3 className="text-sm font-medium text-zinc-300">
            No Products Found
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">
            {searchTerm
              ? "No products match your query"
              : "No products available currently"}
          </p>
          {user?.role === "admin" && (
            <button
              onClick={handleOpenAddModal}
              className="mt-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              Create Product
            </button>
          )}
        </div>
      )}

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onSuccess={fetchProducts}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default HomePage;
