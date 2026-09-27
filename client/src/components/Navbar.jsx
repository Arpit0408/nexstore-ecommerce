import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice.js';
import axiosInstance from '../api/axiosInstance.js';
import toast from 'react-hot-toast';
import { ShoppingBag, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      toast.success('Logged out');
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-white">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-base font-semibold tracking-tight text-white">
            NexStore
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
                <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[11px] font-medium text-zinc-300">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-zinc-300 font-medium">{user?.name}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 p-1.5 sm:px-2.5 sm:py-1 rounded-md text-xs font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
