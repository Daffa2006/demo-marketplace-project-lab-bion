import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import logo from "../assets/ai-generated-black.png";
import { Menu, X, ShoppingCart } from "lucide-react";
import { getInitials } from "../helpers";
import { useAuth } from "../hooks/useAuth";
import AdminOnly from "../routes/AdminOnly";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Tambah useLocation
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActiveLink = (path) => {
    // Exact match untuk home
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Auto close mobile menu saat route berubah
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]); // ✅ Update dependency ke location.pathname

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <header>
      <div>
        <img src={logo} alt="Logo Aplikasi" />
        <nav className={isOpen ? "open" : ""}>
          {isAuthenticated && (
            <>
              <Link
                to="/"
                className={`header-link ${isActiveLink("/") ? "is-active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`header-link ${isActiveLink("/products") ? "is-active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                List product
              </Link>
              <AdminOnly>
                <Link
                  to="/products/create"
                  className={`header-link ${isActiveLink("/products/create") ? "is-active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  Create product
                </Link>
                <Link
                  to="/check-orders"
                  className={`header-link ${isActiveLink("/check-orders") ? "is-active" : ""}`}
                  onClick={() => setIsOpen(false)}
                >
                  Check Orders
                </Link>
              </AdminOnly>
            </>
          )}

          {/* Mobile user profile */}
          {isAuthenticated ? (
            <>
              <div className="mobile-user-profile">
                <div className="avatar-circle">
                  {getInitials(user?.name || "User")}
                </div>
                <div className="username">
                  <div>{user?.name || "User"}</div>
                  <div className="role">{user?.role || "user"}</div>
                </div>
              </div>

              {/* Mobile menu actions */}
              <Link
                to="/profile"
                className={`mobile-menu-item ${isActiveLink("/profile") ? "is-active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Link className="mobile-menu-item logout" onClick={handleLogout}>
                Logout
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className="mobile-menu-item"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>

        <div className="header-right">
          {isAuthenticated ? (
            <div className="user-profile" ref={dropdownRef}>
              <Link to="/carts">
                <ShoppingCart style={{ width: "32px", height: "32px" }} />
              </Link>
              <Link
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="avatar-circle"
              >
                {getInitials(user?.name || "User")}
              </Link>
              {isDropdownOpen && (
                <ul className="user-profile-dropdown">
                  <li className="profile">
                    <div className="avatar-circle">
                      {getInitials(user?.name || "User")}
                    </div>
                    <div className="username">
                      <span>{user?.name || "User"}</span>
                      <span className="role">{user?.role || "user"}</span>
                    </div>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="logout" onClick={handleLogout}>
                      Logout
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="btn primary"
              style={{ marginRight: "1rem" }}
            >
              Login
            </Link>
          )}
          <Link to="/carts">
            <ShoppingCart
              className="mobile-shopping-cart"
              style={{ width: "24px", height: "24px" }}
            />
          </Link>
          <button className="hamburger" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
