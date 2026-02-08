import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const token = localStorage.getItem(
    "online_marketplace_access_token"
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
