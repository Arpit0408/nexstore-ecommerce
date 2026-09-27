import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice.js';
import axiosInstance from '../api/axiosInstance.js';
import toast from 'react-hot-toast';
import { LogIn, Mail, Lock, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/login', data);
      const { user, accessToken } = response.data;

      dispatch(setCredentials({ user, accessToken }));
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach((e) => {
          setError(e.field, { type: 'manual', message: e.message });
        });
      } else {
        toast.error(err.response?.data?.message || 'Invalid email or password');
      }
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-7 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700/60 text-zinc-200 mx-auto flex items-center justify-center mb-3">
            <LogIn className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 bg-white hover:bg-zinc-200 text-zinc-950 font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-zinc-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-zinc-200 hover:underline font-medium"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

