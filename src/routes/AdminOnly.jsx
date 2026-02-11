import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

export default function AdminOnly({ children, routeMode = false }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("online_marketplace_user"));
  const isNotAdmin = user?.role !== "admin";

  useEffect(() => {
    if (isNotAdmin && routeMode) {
      // Push back ke halaman sebelumnya
      navigate(-1);

      // ATAU redirect ke halaman tertentu:
      // navigate("/"); // ke home
      // navigate("/products/lists"); // ke products list
    }
  }, [isNotAdmin, routeMode, navigate]);

  // Jika bukan admin, jangan render apapun
  if (isNotAdmin) return null;

  // Jika admin
  if (routeMode) {
    return <Outlet />;
  } else {
    return children;
  }
}
