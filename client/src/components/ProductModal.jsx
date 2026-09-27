import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance.js';
import toast from 'react-hot-toast';
import { X, Upload, Loader2 } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, productToEdit, onSuccess }) => {
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (productToEdit) {
      reset({
        title: productToEdit.title,
        description: productToEdit.description,
        price: productToEdit.price,
        stock: productToEdit.stock,
      });
      setImagePreview(productToEdit.imageUrl || null);
    } else {
      reset({
        title: '',
        description: '',
        price: '',
        stock: '',
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
  }, [productToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stock', data.stock);

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      if (productToEdit) {
        await axiosInstance.put(`/products/${productToEdit._id}`, formData);
        toast.success('Product updated');
      } else {
        await axiosInstance.post('/products', formData);
        toast.success('Product created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          setError(e.field, { type: 'manual', message: e.message });
        });
      } else {
        toast.error(err.response?.data?.message || 'Action failed');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">
            {productToEdit ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Product title"
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Minimum 3 characters' },
                maxLength: { value: 120, message: 'Maximum 120 characters' },
              })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Product details..."
              {...register('description', {
                required: 'Description is required',
                minLength: { value: 5, message: 'Minimum 5 characters' },
              })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none resize-none"
            />
            {errors.description && <p className="text-[11px] text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0"
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Must be positive' },
                })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
              {errors.price && <p className="text-[11px] text-rose-400 mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Stock
              </label>
              <input
                type="number"
                placeholder="0"
                {...register('stock', {
                  required: 'Stock is required',
                  min: { value: 0, message: 'Cannot be negative' },
                })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
              />
              {errors.stock && <p className="text-[11px] text-rose-400 mt-1">{errors.stock.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Image
            </label>
            <div className="flex items-center gap-3">
              {imagePreview && (
                <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden flex-shrink-0">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <label className="flex-1 border border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-950 rounded-lg p-2.5 cursor-pointer flex items-center justify-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{selectedFile ? selectedFile.name : 'Select file'}</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white rounded-md hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-medium px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
