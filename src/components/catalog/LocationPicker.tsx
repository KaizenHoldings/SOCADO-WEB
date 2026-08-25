"use client";

import { useEffect, useRef, useState } from "react";

interface LocationPickerProps {
  onLocationChange?: (location: { address: string; lat: number; lng: number }) => void;
}

export function LocationPicker({ onLocationChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ lat: 10.4806, lng: -66.9036 });

  // Call onLocationChange whenever address or coords change
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({ address, lat: coords.lat, lng: coords.lng });
    }
  }, [address, coords, onLocationChange]);

  useEffect(() => {
    // Evitar inicializar multiples veces
    if (mapInstanceRef.current || !mapRef.current) return;

    const loadLeaflet = () => {
      // @ts-ignore
      if (typeof window.L === "undefined") {
        setTimeout(loadLeaflet, 100);
        return;
      }
      
      // @ts-ignore
      const L = window.L;

      const map = L.map(mapRef.current, {
        maxBounds: [
          [0.64, -73.38], // Sur-Oeste
          [12.20, -59.80] // Nor-Este
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 5
      }).setView([10.4806, -66.9036], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        attribution: '© OpenStreetMap contributors © CARTO'
      }).addTo(map);

      const marker = L.marker([10.4806, -66.9036], { draggable: true }).addTo(map);
      markerRef.current = marker;

      const reverseGeocode = async (lat: number, lng: number) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          const data = await res.json();
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
        }
      };

      marker.on('dragend', function (e: any) {
        const pos = marker.getLatLng();
        setCoords({ lat: pos.lat, lng: pos.lng });
        reverseGeocode(pos.lat, pos.lng);
      });

      map.on('click', function (e: any) {
        marker.setLatLng(e.latlng);
        setCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      });
    };

    // Agregar CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Agregar JS
    if (!document.getElementById("leaflet-js")) {
      const script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = loadLeaflet;
      document.body.appendChild(script);
    } else {
      loadLeaflet();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const searchAddress = async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 3) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}&countrycodes=ve`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setCoords({ lat, lng: lon });
        
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);
        }
      }
    } catch (err) {
      console.error("Error searching address:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (address) {
        searchAddress(address);
      }
    }, 1000); // Esperar 1 segundo después de dejar de escribir

    return () => clearTimeout(timer);
  }, [address]);

  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-[#063547] dark:text-[#f2eae6]">Dirección del Evento</label>
        <p className="text-xs text-[#6e7c7c] dark:text-[#b2b5a9] mb-1">
          Escribe la dirección y buscaremos en el mapa automáticamente. También puedes hacer clic en el mapa.
        </p>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ej:Caracas Campus"
          className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#f2eae6]"
        />
      </div>

      {/*
        Las coordenadas ya no se muestran, pero `coords` sigue actualizándose con
        cada interacción del mapa y se envía al formulario mediante
        `onLocationChange`, de modo que el payload no cambia.
      */}
      <p className="font-outfit text-sm text-[#6e7c7c] dark:text-[#b2b5a9] -mb-2">
        No te preocupes si no te localizas exactamente en el mapa ya que esta localización es referencial.
      </p>

      <div ref={mapRef} className="h-[300px] w-full rounded-xl border border-black/10 z-0"></div>
    </div>
  );
}
