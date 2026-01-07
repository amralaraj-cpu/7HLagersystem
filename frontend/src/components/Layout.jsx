import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-border h-16 flex items-center px-6">
        <div className="flex items-center space-x-8 flex-1">
          <h1 className="text-2xl font-bold text-primary">7HLager</h1>

          <div className="hidden md:flex space-x-6">
            <Link
              to="/dashboard"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/inventory"
              className="text-text-secondary hover:text-primary transition-colors"
            >
              Lager
            </Link>
            {user?.role === 'admin' && (
              <>
                <Link
                  to="/sales"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Försäljning
                </Link>
                <Link
                  to="/tire-hotel"
                  className="text-text-secondary hover:text-primary transition-colors"
                >
                  Däckhotell
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-text-secondary">
            {user?.first_name} {user?.last_name}
            <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
              {user?.role}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-text-secondary hover:text-red-500 transition-colors"
          >
            Logga ut
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border py-4 px-6 text-center text-sm text-text-secondary">
        <p>
          © 2026 Sjuhärads Biluthyrning & Transport AB - 7HLager v1.0.0
        </p>
      </footer>
    </div>
  );
};

export default Layout;
