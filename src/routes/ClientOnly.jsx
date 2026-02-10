export default function ClientOnly({ children }) {
  const user = JSON.parse(localStorage.getItem("online_marketplace_user"));

  if (user?.role !== "user") return null;

  return children;
}
