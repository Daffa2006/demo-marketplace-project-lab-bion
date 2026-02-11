import { Outlet } from "react-router";
export default function AdminOnly({ children, routeMode = false }) {
  const user = JSON.parse(localStorage.getItem("online_marketplace_user"));

  if (user?.role !== "admin") return null;
  if (routeMode) {
    return <Outlet />;
  } else {
    return children;
  }
}
