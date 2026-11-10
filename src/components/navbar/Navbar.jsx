import { NavLink } from "react-router-dom";
import "./Navbar.css";

export const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  return (
    <nav className="bottom-nav-bar">
      <NavLink to="/favoritos" className="nav-item">
        <span className="nav-icon">⭐</span>
        <span className="nav-text">Favoritos</span>
      </NavLink>
      <NavLink to="/perfil" className="nav-item">
        <span className="nav-icon">👤</span>
        <span className="nav-text">Perfil</span>
      </NavLink>
      <NavLink to="/ajustes" className="nav-item">
        <span className="nav-icon">⚙️</span>
        <span className="nav-text">Ajustes</span>
      </NavLink>
      <NavLink to="/contacto" className="nav-item">
        <span className="nav-icon">✉️</span>
        <span className="nav-text">Contacto</span>
      </NavLink>
      <button
        type="button"
        className="nav-item"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        <span className="nav-icon">{isDarkMode ? "☀️" : "🌙"}</span>
        <span className="nav-text">Tema</span>
      </button>
    </nav>
  );
};
