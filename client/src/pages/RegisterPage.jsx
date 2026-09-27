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
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-7 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-200 mx-auto flex items-center justify-center mb-3">
            <UserPlus className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Create your account to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter your full name"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className={`w-full bg-zinc-950 border ${
                  errors.name ? 'border-rose-500' : 'border-zinc-800'
                } rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`w-full bg-zinc-950 border ${
                  errors.email ? 'border-rose-500' : 'border-zinc-800'
                } rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Minimum 6 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`w-full bg-zinc-950 border ${
                  errors.password ? 'border-rose-500' : 'border-zinc-800'
                } rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors`}
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Re-enter your password"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (val) =>
                    val === passwordValue || 'Passwords do not match',
                })}
                className={`w-full bg-zinc-950 border ${
                  errors.confirmPassword ? 'border-rose-500' : 'border-zinc-800'
                } rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-white hover:bg-zinc-200 text-zinc-950 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-zinc-200 hover:underline font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

