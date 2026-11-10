import { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const savedFavorites = localStorage.getItem("wattyvolt_favorites");
  const initialFavorites = savedFavorites ? JSON.parse(savedFavorites) : [];

  const [favorites, setFavorites] = useState(initialFavorites);

  useEffect(() => {
    localStorage.setItem("wattyvolt_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (station) => {
    setFavorites((prev) => {
      const isAlreadyFav = prev.some((fav) => fav.ID === station.ID);

      if (isAlreadyFav) {
        return prev.filter((fav) => fav.ID !== station.ID);
      } else {
        return [...prev, station];
      }
    });
  };

  const isFavorite = (stationId) => {
    return favorites.some((fav) => fav.ID === stationId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};