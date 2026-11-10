import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

export const RoutingMachine = ({ origin, destination, onRouteFound }) => {
  const map = useMap();

  useEffect(() => {
    if (!origin || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(origin[0], origin[1]),
        L.latLng(destination[0], destination[1]),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      lineOptions: {
        styles: [{ color: "#007bff", weight: 4 }],
      },
      createMarker: () => null,
    }).addTo(map);

    routingControl.on("routesfound", (e) => {
      const route = e.routes[0];
      if (onRouteFound) {
        onRouteFound(route.coordinates);
      }
    });

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, origin, destination, onRouteFound]);

  return null;
};