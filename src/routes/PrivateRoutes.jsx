import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoutes = () => {
    const { currentUser, loading } = useAuth();

    if(loading) {
        return <div>Loading...</div>
    }

    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
}

export default PrivateRoutes;
