import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({
    children,
    requireAdmin = false,
    requiredRoles = [],
    requiredPermissions = []
}) => {
    const { isAuthenticated, loading, hasRole, hasPermission, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check admin requirement
    if (requireAdmin && !isAdmin()) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check role requirements
    if (requiredRoles.length > 0 && !requiredRoles.some(role => hasRole(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check permission requirements
    if (requiredPermissions.length > 0 && !requiredPermissions.some(permission => hasPermission(permission))) {
        return <Navigate to="/unauthorized" replace />;
    }

    console.log('ProtectedRoute: isAuthenticated:', isAuthenticated);

    return <Outlet /> || children;
};

export default ProtectedRoute;