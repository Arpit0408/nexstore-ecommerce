import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import toast from 'react-hot-toast';
import { UserPlus, User, Mail, Lock, Loader2 } from 'lucide-react';

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/register', data);
      toast.success(response.data.message || 'Account created! Please login.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          setError(e.field, { type: 'manual', message: e.message });
        });
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl shadow-black/40">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-sm text-slate-400 mt-1">Register to start managing products</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Arpit Paliwal"
                {...register('name', {
                  required: 'Name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                })}
                className={`w-full bg-slate-950 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`}
              />
            </div>
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please provide a valid email address',
                  },
                })}
                className={`w-full bg-slate-950 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={`w-full bg-slate-950 border ${
                  errors.password ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`}
              />
            </div>
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Re-enter your password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (val) => val === passwordValue || 'Passwords do not match',
                })}
                className={`w-full bg-slate-950 border ${
                  errors.confirmPassword ? 'border-rose-500' : 'border-slate-800'
                } rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
