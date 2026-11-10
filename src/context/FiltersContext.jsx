import { createContext, useState } from "react";

export const FiltersContext = createContext();

export const FiltersProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    networks: [
      "iberdrola",
      "tesla",
      "ionity",
      "endesa",
      "repsol",
      "zunder",
      "wenea",
      "otras",
    ],
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};