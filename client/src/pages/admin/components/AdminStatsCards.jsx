import { Package, DollarSign, AlertTriangle } from "lucide-react";

const AdminStatsCards = ({ products }) => {
  const totalProducts = products.length;
  const totalStockValue = products.reduce(
    (acc, curr) => acc + curr.price * curr.stock,
    0,
  );
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">
            Total Products
          </span>
          <div className="text-2xl font-extrabold text-white mt-0.5">
            {totalProducts}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">
            Inventory Valuation
          </span>
          <div className="text-2xl font-extrabold text-white mt-0.5">
            ₹{totalStockValue.toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs text-slate-500 font-medium">
            Out of Stock
          </span>
          <div className="text-2xl font-extrabold text-rose-400 mt-0.5">
            {outOfStockCount} items
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsCards;
