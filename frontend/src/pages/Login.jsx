import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">7HLager</h1>
          <p className="text-text-secondary">
            Sjuhärads Biluthyrning & Transport AB
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Logga in</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="label">
              E-post
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              value={formData.email}
              onChange={handleChange}
              placeholder="din@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label">
              Lösenord
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Glömt lösenord?
          </Link>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded text-sm">
          <p className="font-semibold mb-2">Demo-konton:</p>
          <p className="text-text-secondary">
            Admin: admin@sjuharads.se / Admin123!
          </p>
          <p className="text-text-secondary">
            User: user@sjuharads.se / User123!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
