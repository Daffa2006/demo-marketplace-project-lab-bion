import { Outlet } from "react-router";
import Navbar from "../Components/Navbar";
export default function MainLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
