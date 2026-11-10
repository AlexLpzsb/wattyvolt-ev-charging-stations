# WattyVolt - EV Route Planner

WattyVolt es una aplicación web diseñada para facilitar la vida a los conductores de vehículos eléctricos. Permite visualizar mapas de cargadores, filtrar por operadores (Tesla, Iberdrola, Zunder, etc.), guardar cargadores favoritos y trazar rutas entre ciudades.

## Características

* **Mapa interactivo:** Visualización en tiempo real de cargadores utilizando *Leaflet* y la API de *OpenChargeMap*.
* **Planificador de rutas:** Visualización de los cargadores entre origen y destino con autocompletado de ciudades (utilizando Nominatim API).
* **Gestión de favoritos:** Guardado de cargadores mediante localStorage.
* **Filtros:** Filtrado de cargadores por red/operador.
* **Modo Claro/Oscuro:** Posibilidad de elección entre modo claro u oscuro.
* **Formulario:** Formulario de contacto validado con react-hook-form.
* **Responsive design:** La interfaz se adapta a pantallas pequeñas.

## Tecnologías

* **React**
* **Vite**
* **React Router DOM**
* **React Hook Form**
* **React Leaflet**
* **OpenChargeMap API & Nominatim API**

## Instalación

1. Clonar el repositorio:

  git clone https://github.com/AlexLpzsb/wattyvolt-ev-charging-stations.git

2. Instalar dependencias:

  npm install

3. Configurar variables de entorno. Crea un archivo .env en la raíz y añade tu API key:

  VITE_OCM_API_KEY=tu_api_key_de_openchargemap

4. Levantar el servidor:

  npm run dev