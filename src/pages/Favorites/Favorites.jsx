import { useContext } from "react";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../../context/FavoritesContext.jsx";
import logo from "../../assets/logo.png";
import watty from "../../assets/watty.png";
import "./Favorites.css";

export const Favorites = () => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  return (
    <div className="favorites-wrapper">
      <div className="glass-card favorites-card">
        <div className="logo-container">
          <img src={logo} alt="WattyVolt" className="brand-logo" />
        </div>

        <h2>Cargadores favoritos</h2>

        {favorites.length === 0 ? (
          <div className="empty-state">
            <img src={watty} alt="Watty" className="watty-empty" />
            <p>Aún no has guardado ningún cargador.</p>
            <span className="empty-hint">
              Ve al mapa, selecciona un marcador y pulsa "Guardar en favoritos".
            </span>
          </div>
        ) : (
          <ul className="favorites-list">
            {favorites.map((station) => (
              <li key={station.ID} className="favorite-item">
                <div className="favorite-info">
                  <strong>{station.AddressInfo.Title}</strong>
                  <span className="fav-detail">
                    📍 {station.AddressInfo.AddressLine1}
                  </span>
                  <span className="fav-detail">
                    🔌 Operador: {station.OperatorInfo?.Title || "Desconocido"}
                  </span>
                  <span className="fav-detail">
                    ⚡ Potencia:{" "}
                    {station.Connections?.[0]?.PowerKW
                      ? `${station.Connections[0].PowerKW} kW`
                      : "Desconocida"}
                  </span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => toggleFavorite(station)}
                  title="Eliminar de favoritos"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}

        <Link to="/" className="back-link">
          ⬅ Volver al mapa
        </Link>
      </div>
    </div>
  );
};