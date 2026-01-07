import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '../api/apiClient';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    apiKey: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.auth.login(formData.apiKey);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">7HLager</h1>
          <p className="text-gray-600">
            Sjuhärads Biluthyrning & Transport AB
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-6">
          {formData.language === 'sv' ? 'Logga in' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              API Key
            </label>
            <input
              id="apiKey"
              name="apiKey"
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.apiKey}
              onChange={handleChange}
              placeholder="Enter your Base44 API key"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.language === 'sv'
                ? 'Använd din Base44 API-nyckel för att logga in'
                : 'Use your Base44 API key to login'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded text-sm border border-blue-200">
          <p className="font-semibold mb-2 text-blue-900">Development API Key:</p>
          <p className="text-blue-700 font-mono text-xs break-all">
            {import.meta.env.VITE_BASE44_API_KEY}
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Copy this key to login during development
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
