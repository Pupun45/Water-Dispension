import React, { useState, useEffect, useRef } from "react";

const CYAN = "#06b6d4";

const MapTab = ({ tanks }) => {
  const mapRef    = useRef(null);
  const leafletMap = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!window.L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    } else { setLoaded(true); }
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; }
    const L = window.L;
    const center = [20.2961, 85.8245];
    const map = L.map(mapRef.current).setView(center, 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    tanks.forEach(t => {
      const lat = t.lat ?? center[0];
      const lng = t.lng ?? center[1];
      const col = t.remaining > 0 ? "#22d3ee" : "#f87171";
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${col};width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 8px ${col}"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      L.marker([lat, lng], { icon }).addTo(map)
        .bindPopup(`<b>${t.name || t._id.slice(-6)}</b><br/>TDS: ${t.tds ?? "—"} ppm<br/>pH: ${t.ph_level ?? "—"}<br/>Remaining: ${t.remaining} L`);
    });
    leafletMap.current = map;
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, [loaded, tanks]);

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Live Location Map</h2>
      <div style={{ display: "flex", gap: "18px", height: "calc(100vh - 180px)", minHeight: "400px" }}>
        <div ref={mapRef} style={{
          flex: 1, borderRadius: "16px", overflow: "hidden",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }}/>
        <div style={{ width: "250px", display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Nodes</div>
          {tanks.map(t => (
            <div key={t._id} style={{
              background: "#fff", borderRadius: "12px", padding: "14px 16px",
              border: "1px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              transition: "border-color 0.18s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = CYAN}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#f1f5f9"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <div style={{
                  width: "9px", height: "9px", borderRadius: "50%", flexShrink: 0,
                  background: t.remaining > 0 ? "#22c55e" : "#f87171",
                  boxShadow: `0 0 5px ${t.remaining > 0 ? "#22c55e" : "#f87171"}`,
                }}/>
                <span style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>
                  {t.name || `Dispenser #${t._id.slice(-5)}`}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>Remaining: <strong>{t.remaining} L</strong></div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                TDS: <span style={{ color: "#ec4899", fontWeight: "600" }}>{t.tds ?? "—"} ppm</span>
                &nbsp;|&nbsp;
                pH: <span style={{ color: "#f97316", fontWeight: "600" }}>{t.ph_level ?? "—"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapTab;
