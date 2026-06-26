import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ background: 'linear-gradient(135deg, #f5f3ff, #ffffff)', borderBottom: '1px solid #e9e3ff' }}
      className="px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
          AI
        </div>
        <span className="font-semibold text-gray-900 text-lg">Interview <span className="text-violet-600">Prep</span></span>
      </Link>
      <div className="flex gap-3 items-center">
        {user ? (
          <>
            <span className="text-gray-500 text-sm">Hi, <span className="text-gray-800 font-medium">{user.name}</span></span>
            <button
              onClick={handleLogout}
              className="border border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg text-sm transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-500 hover:text-gray-800 text-sm transition-colors">Login</Link>
            <Link to="/register" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;