import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';

const AdminPrivateRoute = ({ Component }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && !loading ? (
    <Component />
  ) : (
    <Navigate to="/login" replace />
  );
};

export default AdminPrivateRoute;