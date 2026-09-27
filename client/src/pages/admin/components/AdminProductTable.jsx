import { Package, Edit2, Trash2 } from 'lucide-react';

const AdminProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
          <tr>
            <th className="py-3.5 px-4">Product</th>
            <th className="py-3.5 px-4">Price</th>
            <th className="py-3.5 px-4">Stock</th>
            <th className="py-3.5 px-4">Created By</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
              <td className="py-3.5 px-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden flex-shrink-0">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <Package className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <span className="font-medium text-white max-w-xs truncate">{p.title}</span>
              </td>
              <td className="py-3.5 px-4 font-semibold text-white">₹{p.price.toLocaleString('en-IN')}</td>
              <td className="py-3.5 px-4">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    p.stock > 0
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-400">{p.createdBy?.name || 'Admin'}</td>
              <td className="py-3.5 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(p)}
                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(p._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductTable;
