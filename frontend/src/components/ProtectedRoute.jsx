// components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuth = !!localStorage.getItem('access_token');

  return isAuth ? children : <Navigate to="/login" replace />;
}