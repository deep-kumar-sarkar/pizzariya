import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./NavBar.css";

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">PIZZARIYA</div>
      <ul className="navbar-links">
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/menu"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Menu
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/order"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Order
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/review"
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            Review
          </NavLink>
        </li>
        {isAuthenticated && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavBar;
