import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home.jsx";
import { Contact } from "./pages/Contact/Contact.jsx";
import { Favorites } from "./pages/Favorites/Favorites.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/favoritos" element={<Favorites />} />
      <Route path="*" element={<h2>404 - Página no encontrada</h2>} />
    </Routes>
  );
}

export default App;