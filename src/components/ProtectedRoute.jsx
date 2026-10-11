import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="state">Loading…</p>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="page narrow">
        <h1>Admin only</h1>
        <p className="muted">Your account does not have access to this page.</p>
      </div>
    );
  }
  return children;
}
