function getUserFromToken() {
  try {
    const token = localStorage.getItem("online_marketplace_access_token");

    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
export default function AdminOnly({ children }) {
  const user = getUserFromToken();

  if (user?.role !== "admin") return null;

  return children;
}
