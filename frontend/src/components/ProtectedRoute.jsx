import { Navigate } from 'react-router-dom';
import { base44 } from '../api/apiClient';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = base44.auth.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
