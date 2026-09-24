import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children, role = null, authRequired = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          <p className="text-sm font-medium text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Route requires login
  if (authRequired && !user) {
    return <Navigate to="/login" replace />;
  }

  // Seller cannot access buyer routes
  if (role === "buyer" && user?.role === "seller") {
    return <Navigate to="/seller/products" replace />;
  }

  // Specific role required
  if (role && user && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Protected;
