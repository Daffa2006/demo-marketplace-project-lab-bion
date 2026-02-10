export default function AdminOnly({ children }) {
  const user = JSON.parse(localStorage.getItem("online_marketplace_user"));

  if (user?.role !== "admin") return null;

  return children;
}
