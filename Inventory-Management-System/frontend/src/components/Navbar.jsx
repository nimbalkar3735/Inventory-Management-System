import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/dashboard" className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <span>Inventory<span className="logo-accent">Hub</span></span>
        </NavLink>

        <button
          type="button"
          className={`navbar-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`navbar-nav ${menuOpen ? "open" : ""}`}>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Dashboard
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Products
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Categories
          </NavLink>
          <NavLink to="/low-stock" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMenu}>
            Low Stock
          </NavLink>
        </nav>

        <div className="navbar-user">
          {user && <span className="user-badge">{user.name || user.email}</span>}
          <button onClick={handleLogout} className="btn-logout" title="Log out of system">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
