import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/AuthStore";
import { jwtDecode } from "jwt-decode";

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: string[];
}

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
}

//custom route to only allow e.g. users to visit user-dashboard
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const logout = useAuthStore((state) => state.logout);

  if (!token || isTokenExpired(token)) {
    logout();
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role ?? "")) {
    //user is unauthorized
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
