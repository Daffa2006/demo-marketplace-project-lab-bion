import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import logo from "../assets/ai-generated-black.png";
import { Menu, X, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

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
  }, []);

  function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  return (
    <header>
      <div>
        <img src={logo} alt="Logo Aplikasi" />
        <nav className={isOpen ? "open" : ""}>
          <Link to="/" className="header-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/products"
            className="header-link"
            onClick={() => setIsOpen(false)}
          >
            List product
          </Link>
          <Link
            to="/products/create"
            className="header-link"
            onClick={() => setIsOpen(false)}
          >
            Create product
          </Link>
          <Link
            to="/check-orders"
            className="header-link"
            onClick={() => setIsOpen(false)}
          >
            Check Orders
          </Link>

          {/* Mobile user profile */}
          <div className="mobile-user-profile">
            <div className="avatar-circle">
              {getInitials("Daffa Anaqi Farid")}
            </div>
            <div className="username">
              <div>Daffa Anaqi Farid</div>
              <div className="role">Admin</div>
            </div>
          </div>

          {/* Mobile menu actions */}
          <Link
            to="/profile"
            className="mobile-menu-item"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            className="mobile-menu-item logout"
            onClick={() => setIsOpen(false)}
          >
            Logout
          </Link>
        </nav>

        <div className="header-right">
          <div className="user-profile" ref={dropdownRef}>
            <Link to="/carts">
              <ShoppingCart style={{ width: "32px", height: "32px" }} />
            </Link>
            <Link
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="avatar-circle"
            >
              {getInitials("Daffa Anaqi Farid")}
            </Link>
            {isDropdownOpen && (
              <ul className="user-profile-dropdown">
                <li className="profile">
                  <div className="avatar-circle">
                    {getInitials("Daffa Anaqi Farid")}
                  </div>
                  <div className="username">
                    <span>Daffa Anaqi Farid</span>
                    <span className="role">Admin</span>
                  </div>
                </li>
                <li>
                  <Link to="/profile" onClick={() => setIsDropdownOpen(false)}>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="logout"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
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
