export default function ClientOnly({ children, routeMode = false }) {
  const user = JSON.parse(localStorage.getItem("online_marketplace_user"));

  if (user?.role !== "user") return null;
  if (routeMode) {
    return <Outlet />;
  } else {
    return children;
  }
}
