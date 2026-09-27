import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance.js';
import ProductModal from '../../components/ProductModal.jsx';
import DeleteConfirmModal from '../../components/DeleteConfirmModal.jsx';
import AdminStatsCards from './components/AdminStatsCards.jsx';
import AdminProductTable from './components/AdminProductTable.jsx';
import toast from 'react-hot-toast';
import { PlusCircle, Search, Loader2, ShieldCheck } from 'lucide-react';

const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Custom Delete Modal State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/products', {
        params: { limit: 100 },
      });
      setProducts(response.data.products);
    } catch (err) {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id) => {
    setDeleteProductId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductId) return;
    setDeleteLoading(true);

    try {
      await axiosInstance.delete(`/products/${deleteProductId}`);
      toast.success('Product deleted successfully');
      setIsDeleteOpen(false);
      setDeleteProductId(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Super Admin
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">Manage all store inventory and stock levels</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Stats Cards */}
      <AdminStatsCards products={products} />

      {/* Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search table by name..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <span className="text-xs text-slate-500">Showing {filteredProducts.length} items</span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-2" />
            <span className="text-xs">Loading inventory data...</span>
          </div>
        ) : (
          <AdminProductTable
            products={filteredProducts}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        )}
      </div>

      {/* Add / Edit Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onSuccess={fetchProducts}
      />

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminDashboardPage;
