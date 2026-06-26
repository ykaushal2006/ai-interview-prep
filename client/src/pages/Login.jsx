import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #f5f3ff 0%, #f4f5f7 50%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            AI
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to continue your interview prep</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-gray-600 text-xs font-semibold mb-2 block uppercase tracking-wider">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-600 text-xs font-semibold mb-2 block uppercase tracking-wider">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary py-3 rounded-xl font-semibold mt-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          <p className="text-gray-500 text-sm text-center mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 hover:text-violet-700 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;