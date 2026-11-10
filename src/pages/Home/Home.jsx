import { useContext, useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import { useForm } from "react-hook-form";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import polyline from "@mapbox/polyline";
import { FiltersContext } from "../../context/FiltersContext.jsx";
import { FavoritesContext } from "../../context/FavoritesContext.jsx";
import { useOcmFetch } from "../../hooks/useOcmFetch.js";
import { RoutingMachine } from "../../components/map/RoutingMachine.jsx";
import { Navbar } from "../../components/navbar/Navbar.jsx";
import logo from "../../assets/logo.png";
import watty from "../../assets/watty.png";
import "./Home.css";

const ALL_NETWORKS = [
  "iberdrola",
  "tesla",
  "ionity",
  "endesa",
  "repsol",
  "zunder",
  "wenea",
  "otras",
];

export const Home = () => {
  const { filters, setFilters } = useContext(FiltersContext);
  const { toggleFavorite, isFavorite } = useContext(FavoritesContext);
  const defaultPosition = [40.4168, -3.7038];

  const [apiUrl, setApiUrl] = useState("");
  const { data: stations } = useOcmFetch(apiUrl);
  const [routeCoords, setRouteCoords] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [origenSuggestions, setOrigenSuggestions] = useState([]);
  const [destinoSuggestions, setDestinoSuggestions] = useState([]);

  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();

  const origenValue = watch("origen");
  const destinoValue = watch("destino");

  useEffect(() => {
    const baseUrl = "https://api.openchargemap.io/v3/poi/";
    const queryParams = `?output=json&latitude=${defaultPosition[0]}&longitude=${defaultPosition[1]}&distance=50&distanceunit=KM&maxresults=50`;
    setApiUrl(`${baseUrl}${queryParams}`);
  }, []);

  const fetchSuggestions = async (query, setter) => {
    if (!query || query.length < 3) {
      setter([]);
      setActiveSuggestionIndex(-1);
      return;
    }
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
      const data = await res.json();
      setter(data);
      setActiveSuggestionIndex(-1);
    } catch (err) {
      console.error("Error cargando sugerencias:", err);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(origenValue, setOrigenSuggestions);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [origenValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(destinoValue, setDestinoSuggestions);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [destinoValue]);

  const handleKeyDown = (e, suggestions, setSuggestions, fieldName) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedIndex = activeSuggestionIndex >= 0 ? activeSuggestionIndex : 0;
      setValue(fieldName, suggestions[selectedIndex].display_name);
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      setActiveSuggestionIndex(-1);
    }
  };

  const handleRouteFound = useCallback((coordinates) => {
    const simplifiedCoords = coordinates.filter((_, index) => index % 20 === 0);
    const points = simplifiedCoords.map((c) => [c.lat, c.lng]);
    const encodedRoute = polyline.encode(points);
    const baseUrl = "https://api.openchargemap.io/v3/poi/";
    const queryParams = `?output=json&polyline=${encodedRoute}&distance=5&distanceunit=KM&maxresults=500`;
    setApiUrl(`${baseUrl}${queryParams}`);
  }, []);

  const onSubmit = async (data) => {
    const getCoordinates = async (place) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
        const result = await response.json();
        return result.length > 0 ? [parseFloat(result[0].lat), parseFloat(result[0].lon)] : null;
      } catch (err) {
        console.error("Error al buscar coordenadas:", err);
        return null;
      }
    };

    const originCoords = await getCoordinates(data.origen);
    const destCoords = await getCoordinates(data.destino);

    if (originCoords && destCoords) {
      setRouteCoords({ origin: originCoords, destination: destCoords });
      setOrigenSuggestions([]);
      setDestinoSuggestions([]);
    } else {
      alert("No hemos podido localizar una de las ciudades. Prueba a ser más específico.");
    }
  };

  const handleNetworkChange = (networkValue) => {
    setFilters((prev) => {
      const isSelected = prev.networks.includes(networkValue);
      if (isSelected) {
        return { ...prev, networks: prev.networks.filter((n) => n !== networkValue) };
      } else {
        return { ...prev, networks: [...prev.networks, networkValue] };
      }
    });
  };

  const toggleAllNetworks = () => {
    setFilters((prev) => {
      if (prev.networks.length === ALL_NETWORKS.length) {
        return { ...prev, networks: [] };
      }
      return { ...prev, networks: ALL_NETWORKS };
    });
  };

  const filteredStations = stations?.filter((station) => {
    if (filters.networks.length === 0) return false;
    const operatorName = station.OperatorInfo?.Title?.toLowerCase() || "";
    const isIberdrola = operatorName.includes("iberdrola");
    const isTesla = operatorName.includes("tesla");
    const isIonity = operatorName.includes("ionity");
    const isEndesa = operatorName.includes("endesa");
    const isRepsol = operatorName.includes("repsol");
    const isZunder = operatorName.includes("zunder");
    const isWenea = operatorName.includes("wenea");
    const isOtra = !isIberdrola && !isTesla && !isIonity && !isEndesa && !isRepsol && !isZunder && !isWenea;

    if (isIberdrola && filters.networks.includes("iberdrola")) return true;
    if (isTesla && filters.networks.includes("tesla")) return true;
    if (isIonity && filters.networks.includes("ionity")) return true;
    if (isEndesa && filters.networks.includes("endesa")) return true;
    if (isRepsol && filters.networks.includes("repsol")) return true;
    if (isZunder && filters.networks.includes("zunder")) return true;
    if (isWenea && filters.networks.includes("wenea")) return true;
    if (isOtra && filters.networks.includes("otras")) return true;

    return false;
  });

  const getNetworkIcon = (operatorName) => {
    const name = operatorName?.toLowerCase() || "";
    let color = "grey";
    if (name.includes("iberdrola")) color = "green";
    else if (name.includes("tesla")) color = "red";
    else if (name.includes("ionity")) color = "violet";
    else if (name.includes("endesa")) color = "blue";
    else if (name.includes("repsol")) color = "orange";
    else if (name.includes("zunder")) color = "black";
    else if (name.includes("wenea")) color = "gold";

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });
  };

  return (
    <div className={`home-dashboard ${isDarkMode ? "dark-mode" : ""}`}>
      <main className="map-area">
        <MapContainer center={defaultPosition} zoom={10} maxNativeZoom={19} maxZoom={22} className="leaflet-map-container" zoomControl={false}>
          <ZoomControl position="bottomright" /> 
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' maxNativeZoom={19} maxZoom={22} />
          
          {filteredStations?.map((station) => {
            const isFav = isFavorite(station.ID);
            return (
              <Marker key={station.ID} position={[station.AddressInfo.Latitude, station.AddressInfo.Longitude]} icon={getNetworkIcon(station.OperatorInfo?.Title)}>
                <Popup>
                  <div className="popup-content">
                    <strong>{station.AddressInfo.Title}</strong><br />
                    {station.AddressInfo.AddressLine1}<br />
                    Operador: {station.OperatorInfo?.Title || "Desconocido"}<br />
                    Potencia máxima: {station.Connections?.[0]?.PowerKW ? `${station.Connections[0].PowerKW} kW` : "Desconocida"}<br />
                    
                    <button 
                      className={`popup-fav-btn ${isFav ? "is-fav" : ""}`}
                      onClick={() => toggleFavorite(station)}
                    >
                      {isFav ? "⭐ Quitar de favoritos" : "⭐ Guardar en favoritos"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {routeCoords && <RoutingMachine origin={routeCoords.origin} destination={routeCoords.destination} onRouteFound={handleRouteFound} />}
        </MapContainer>
      </main>

      <div className="sidebar-wrapper">
        <aside className="sidebar">
          <div className="logo-container">
            <img src={logo} alt="WattyVolt" className="brand-logo" />
          </div>
          
          <div className="filter-section">
            <h3>Cargadores</h3>
            <div className="toggle-btn-container">
              <button type="button" className="toggle-btn" onClick={toggleAllNetworks}>
                {filters.networks.length === ALL_NETWORKS.length ? "Desmarcar todos" : "Marcar todas"}
              </button>
            </div>
            <div className="checkbox-group">
              {ALL_NETWORKS.map(network => (
                <label className="checkbox-label" key={network}>
                  <input type="checkbox" checked={filters.networks.includes(network)} onChange={() => handleNetworkChange(network)} /> 
                  {network.charAt(0).toUpperCase() + network.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <div className="route-section">
            <h3>Ruta</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="route-inputs">
              
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Origen (ej. Madrid)..." 
                  autoComplete="off" 
                  {...register("origen", { required: "El origen es obligatorio" })}
                  onKeyDown={(e) => handleKeyDown(e, origenSuggestions, setOrigenSuggestions, "origen")}
                />
                {errors.origen && <span className="error-message">{errors.origen.message}</span>}
                
                {origenSuggestions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {origenSuggestions.map((sug, index) => (
                      <li 
                        key={sug.place_id} 
                        className={index === activeSuggestionIndex ? "active" : ""}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onClick={() => {
                          setValue("origen", sug.display_name);
                          setOrigenSuggestions([]);
                          setActiveSuggestionIndex(-1);
                        }}
                      >
                        {sug.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Destino (ej. Valencia)..." 
                  autoComplete="off" 
                  {...register("destino", { required: "El destino es obligatorio" })} 
                  onKeyDown={(e) => handleKeyDown(e, destinoSuggestions, setDestinoSuggestions, "destino")}
                />
                {errors.destino && <span className="error-message">{errors.destino.message}</span>}
                
                {destinoSuggestions.length > 0 && (
                  <ul className="autocomplete-dropdown">
                    {destinoSuggestions.map((sug, index) => (
                      <li 
                        key={sug.place_id} 
                        className={index === activeSuggestionIndex ? "active" : ""}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onClick={() => {
                          setValue("destino", sug.display_name);
                          setDestinoSuggestions([]);
                          setActiveSuggestionIndex(-1);
                        }}
                      >
                        {sug.display_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <button type="submit">Trazar ruta</button>
            </form>
          </div>

          <div className="mascot-container mobile-hidden">
            <img src={watty} alt="Watty" className="watty-mascot" />
          </div>
        </aside>

        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        
      </div>
    </div>
  );
};