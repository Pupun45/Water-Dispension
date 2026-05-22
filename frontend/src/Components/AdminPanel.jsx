import React, { useState, useEffect, useRef } from "react";

/* ─── Constants ─────────────────────────────────────────── */
const ADMIN_CREDENTIALS = { id: "admin", password: "Water@2024" };
const RECOVERY_KEY = import.meta.env.VITE_ADMIN_RECOVERY_KEY;

const BG = "linear-gradient(135deg, rgb(10,15,30) 0%, rgb(13,27,42) 50%, rgb(10,25,47) 100%)";
const CYAN = "#06b6d4";
const SIDEBAR_W = "240px";

/* ─── Sensor generator ──────────────────────────────────── */
const genSensors = () => ({
  waterCapacity: (Math.random() * 200 + 50).toFixed(1),
  waterTemp:     (Math.random() * 10  + 20).toFixed(1),
  waterLevel:    (Math.random() * 90  + 10).toFixed(1),
  envTemp:       (Math.random() * 15  + 25).toFixed(1),
  dissolvedO2:   (Math.random() * 4   +  6).toFixed(2),
  turbidity:     (Math.random() * 5       ).toFixed(2),
  tds:           (Math.random() * 200 + 100).toFixed(0),
  phLevel:       (Math.random() * 2   + 6.5).toFixed(2),
});

/* ─── Default dispensers ────────────────────────────────── */
const INIT_DISPENSERS = [
  { id: 1, name: "Main Gate Station", lat: 20.2961, lng: 85.8245, status: "active",   sensors: genSensors() },
  { id: 2, name: "Park Block B",      lat: 20.2975, lng: 85.8260, status: "active",   sensors: genSensors() },
  { id: 3, name: "Market Square",     lat: 20.2950, lng: 85.8235, status: "inactive", sensors: genSensors() },
];

/* ─── Sidebar nav items ─────────────────────────────────── */
const NAV = [
  { key: "dashboard",   label: "Dashboard",    icon: "📊" },
  { key: "dispensers",  label: "Dispensers",   icon: "🗂️" },
  { key: "map",         label: "Live Map",     icon: "🗺️" },
  { key: "credentials", label: "Credentials",  icon: "🔐" },
];

/* ═══════════════════════════════════════════════════════════
   SIDEBAR COMPONENT
═══════════════════════════════════════════════════════════ */
const Sidebar = ({ active, setActive, onClose }) => (
  <aside style={{
    width: SIDEBAR_W,
    flexShrink: 0,
    background: BG,
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    overflow: "hidden",
    position: "relative",
  }}>
    {/* Logo */}
    <div style={{
      padding: "28px 24px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: `linear-gradient(135deg, ${CYAN}, #3b82f6)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px", flexShrink: 0,
          boxShadow: `0 4px 14px rgba(6,182,212,0.35)`,
        }}>💧</div>
        <div>
          <div style={{ color: "#fff", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.3px" }}>
            AquaAdmin
          </div>
          <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "11px", marginTop: "1px" }}>
            v1.0 • Admin
          </div>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{
        fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
        padding: "0 12px", marginBottom: "8px",
      }}>
        Navigation
      </div>

      {NAV.map(n => {
        const isActive = active === n.key;
        return (
          <button
            key={n.key}
            onClick={() => setActive(n.key)}
            style={{
              width: "100%",
              display: "flex", alignItems: "center", gap: "12px",
              padding: "11px 14px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: isActive
                ? "rgba(255,255,255,0.10)"
                : "transparent",
              color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: "14px", fontWeight: isActive ? "700" : "500",
              textAlign: "left",
              transition: "all 0.18s",
              position: "relative",
              fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {/* Active indicator bar */}
            {isActive && (
              <div style={{
                position: "absolute", left: 0, top: "20%", bottom: "20%",
                width: "3px", borderRadius: "0 3px 3px 0",
                background: CYAN,
              }} />
            )}
            <span style={{ fontSize: "17px", lineHeight: 1 }}>{n.icon}</span>
            <span>{n.label}</span>
            {isActive && (
              <span style={{
                marginLeft: "auto", width: "6px", height: "6px",
                borderRadius: "50%", background: CYAN,
                boxShadow: `0 0 6px ${CYAN}`,
              }} />
            )}
          </button>
        );
      })}
    </nav>

    {/* Logout / Close */}
    <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button
        onClick={onClose}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: "10px",
          padding: "11px 14px", borderRadius: "10px",
          border: "1px solid rgba(239,68,68,0.25)",
          background: "rgba(239,68,68,0.08)",
          color: "#f87171", fontSize: "14px", fontWeight: "600",
          cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
      >
        <span style={{ fontSize: "17px" }}>🚪</span> Exit Panel
      </button>
    </div>
  </aside>
);

/* ═══════════════════════════════════════════════════════════
   TOP BAR
═══════════════════════════════════════════════════════════ */
const TopBar = ({ title, subtitle }) => (
  <div style={{
    height: "64px", flexShrink: 0,
    background: "#fff",
    borderBottom: "1px solid #f1f5f9",
    display: "flex", alignItems: "center",
    padding: "0 28px",
    justifyContent: "space-between",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  }}>
    <div>
      <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>{title}</h1>
      <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>{subtitle}</p>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {/* Live badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "5px 12px", borderRadius: "20px",
        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
      }}>
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#22c55e",
          animation: "pulseDot 2s infinite",
        }} />
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a" }}>Live</span>
      </div>
      {/* Avatar */}
      <div style={{
        width: "36px", height: "36px", borderRadius: "10px",
        background: `linear-gradient(135deg, ${CYAN}, #3b82f6)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: "800", fontSize: "14px",
      }}>A</div>
    </div>
    <style>{`
      @keyframes pulseDot {
        0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
        50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
      }
    `}</style>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   SENSOR CARD
═══════════════════════════════════════════════════════════ */
const SensorCard = ({ label, value, unit, icon, color, bg }) => (
  <div style={{
    background: "#fff",
    borderRadius: "16px",
    padding: "22px 20px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column", gap: "10px",
    position: "relative", overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "default",
  }}
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-3px)";
      e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.1)`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
    }}
  >
    {/* Top colour strip */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "4px",
      background: `linear-gradient(90deg, ${color}, ${color}55)`,
    }} />
    {/* Icon bubble */}
    <div style={{
      width: "42px", height: "42px", borderRadius: "12px",
      background: bg || `${color}15`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "20px",
    }}>{icon}</div>
    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600",
      textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: "5px" }}>
      <span style={{ fontSize: "28px", fontWeight: "800", color: color,
        fontVariantNumeric: "tabular-nums" }}>{value}</span>
      <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "600" }}>{unit}</span>
    </div>
    {/* Decorative circle */}
    <div style={{
      position: "absolute", bottom: "-14px", right: "-14px",
      width: "70px", height: "70px", borderRadius: "50%",
      background: `${color}0d`,
    }} />
  </div>
);

/* ═══════════════════════════════════════════════════════════
   DASHBOARD TAB
═══════════════════════════════════════════════════════════ */
const DashboardTab = ({ dispensers, selected, setSelected }) => {
  const s = selected?.sensors || {};
  return (
    <div>
      {/* Dispenser pills */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
        {dispensers.map(d => {
          const isSel = selected?.id === d.id;
          return (
            <button key={d.id} onClick={() => setSelected(d)} style={{
              padding: "8px 18px", borderRadius: "40px",
              border: isSel ? `2px solid ${CYAN}` : "1.5px solid #e2e8f0",
              background: isSel ? `linear-gradient(135deg, ${CYAN}22, #3b82f622)` : "#fff",
              color: isSel ? CYAN : "#64748b",
              fontSize: "13px", fontWeight: "700",
              cursor: "pointer", transition: "all 0.18s",
              display: "flex", alignItems: "center", gap: "8px",
              fontFamily: "inherit",
              boxShadow: isSel ? `0 0 0 3px ${CYAN}22` : "none",
            }}>
              <span style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: d.status === "active" ? "#22c55e" : "#f87171",
                display: "inline-block", flexShrink: 0,
              }} />
              {d.name}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "18px" }}>
        <SensorCard label="Water Capacity" value={s.waterCapacity} unit="L"     icon="🫙" color="#06b6d4" />
        <SensorCard label="Water Temp"     value={s.waterTemp}     unit="°C"    icon="🌡️" color="#3b82f6" />
        <SensorCard label="Water Level"    value={s.waterLevel}    unit="%"     icon="💧" color="#0ea5e9" />
        <SensorCard label="Env. Temp"      value={s.envTemp}       unit="°C"    icon="🌤️" color="#f59e0b" />
        <SensorCard label="Dissolved O₂"  value={s.dissolvedO2}   unit="mg/L"  icon="🌬️" color="#10b981" />
        <SensorCard label="Turbidity"      value={s.turbidity}     unit="NTU"   icon="🔬" color="#8b5cf6" />
        <SensorCard label="TDS"            value={s.tds}           unit="ppm"   icon="⚗️" color="#ec4899" />
        <SensorCard label="pH Level"       value={s.phLevel}       unit=""      icon="🧪" color="#f97316" />
      </div>

      <p style={{ marginTop: "20px", fontSize: "12px", color: "#cbd5e1" }}>
        ⟳ Live data refreshes every 4 seconds
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   DISPENSERS TAB
═══════════════════════════════════════════════════════════ */
const DispensersTab = ({ dispensers, setDispensers, setSelected, setTab }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", lat: "", lng: "" });

  const add = () => {
    if (!form.name || !form.lat || !form.lng) return;
    setDispensers(p => [...p, {
      id: Date.now(), name: form.name,
      lat: parseFloat(form.lat), lng: parseFloat(form.lng),
      status: "active", sensors: genSensors(),
    }]);
    setForm({ name: "", lat: "", lng: "" });
    setShowForm(false);
  };

  const remove = id => setDispensers(p => p.filter(d => d.id !== id));

  const InputF = ({ label, field, ph }) => (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: "700",
        color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em",
        marginBottom: "6px" }}>{label}</label>
      <input value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
        placeholder={ph} style={{
          width: "100%", boxSizing: "border-box",
          padding: "10px 13px", fontSize: "13px",
          color: "#1e293b", background: "#f8fafc",
          border: "1.5px solid #e2e8f0", borderRadius: "9px",
          outline: "none", fontFamily: "inherit",
        }}
        onFocus={e => { e.target.style.borderColor = CYAN; }}
        onBlur={e => { e.target.style.borderColor = "#e2e8f0"; }}
      />
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
          Dispenser Locations
        </h2>
        <button onClick={() => setShowForm(s => !s)} style={{
          padding: "9px 20px", borderRadius: "10px",
          border: `1.5px solid ${CYAN}`,
          background: showForm ? `${CYAN}22` : "#fff",
          color: CYAN, cursor: "pointer", fontWeight: "700",
          fontSize: "13px", transition: "all 0.18s", fontFamily: "inherit",
        }}>
          {showForm ? "✕ Cancel" : "+ Add Dispenser"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{
          background: "#fff", borderRadius: "14px",
          border: `1.5px solid ${CYAN}44`,
          padding: "22px", marginBottom: "20px",
          boxShadow: "0 4px 20px rgba(6,182,212,0.1)",
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto",
          gap: "14px", alignItems: "end",
        }}>
          <InputF label="Place Name" field="name" ph="e.g. City Park" />
          <InputF label="Latitude"   field="lat"  ph="e.g. 20.2961"  />
          <InputF label="Longitude"  field="lng"  ph="e.g. 85.8245"  />
          <button onClick={add} style={{
            padding: "10px 22px", borderRadius: "9px", border: "none",
            background: `linear-gradient(135deg, ${CYAN}, #3b82f6)`,
            color: "#fff", fontWeight: "800", fontSize: "14px",
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: "0 4px 12px rgba(6,182,212,0.3)",
          }}>Add</button>
        </div>
      )}

      {/* Table */}
      <div style={{
        background: "#fff", borderRadius: "16px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["#","Place Name","Latitude","Longitude","Status","TDS","pH","Level","Actions"].map(h => (
                <th key={h} style={{
                  padding: "13px 16px", textAlign: "left",
                  fontSize: "11px", fontWeight: "700", color: "#94a3b8",
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  borderBottom: "1px solid #f1f5f9",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dispensers.map((d, i) => (
              <tr key={d.id} style={{ borderTop: "1px solid #f8fafc", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = ""}
                onClick={() => { setSelected(d); setTab("dashboard"); }}
              >
                <td style={{ padding: "13px 16px", color: "#cbd5e1", fontSize: "13px" }}>{i + 1}</td>
                <td style={{ padding: "13px 16px", color: "#0f172a", fontWeight: "700", fontSize: "14px" }}>{d.name}</td>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: "13px", fontVariantNumeric: "tabular-nums" }}>{d.lat}</td>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: "13px", fontVariantNumeric: "tabular-nums" }}>{d.lng}</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700",
                    background: d.status === "active" ? "#dcfce7" : "#fee2e2",
                    color: d.status === "active" ? "#16a34a" : "#dc2626",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>{d.status}</span>
                </td>
                <td style={{ padding: "13px 16px", color: "#ec4899", fontWeight: "600", fontSize: "13px" }}>{d.sensors.tds} ppm</td>
                <td style={{ padding: "13px 16px", color: "#f97316", fontWeight: "600", fontSize: "13px" }}>{d.sensors.phLevel}</td>
                <td style={{ padding: "13px 16px", color: CYAN, fontWeight: "600", fontSize: "13px" }}>{d.sensors.waterLevel}%</td>
                <td style={{ padding: "13px 16px" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => remove(d.id)} style={{
                    padding: "5px 12px", borderRadius: "7px",
                    border: "1px solid #fca5a5", background: "#fef2f2",
                    color: "#dc2626", cursor: "pointer", fontSize: "12px",
                    fontWeight: "600", fontFamily: "inherit",
                  }}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAP TAB
═══════════════════════════════════════════════════════════ */
const MapTab = ({ dispensers }) => {
  const mapRef = useRef(null);
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
    const map = L.map(mapRef.current).setView([20.2961, 85.8245], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);
    dispensers.forEach(d => {
      const col = d.status === "active" ? "#22d3ee" : "#f87171";
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${col};width:16px;height:16px;border-radius:50%;border:3px solid #fff;box-shadow:0 0 8px ${col}"></div>`,
        iconSize: [16, 16], iconAnchor: [8, 8],
      });
      L.marker([d.lat, d.lng], { icon }).addTo(map)
        .bindPopup(`<b>${d.name}</b><br/>Status: ${d.status}<br/>TDS: ${d.sensors.tds} ppm`);
    });
    leafletMap.current = map;
    return () => { if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current = null; } };
  }, [loaded, dispensers]);

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
        Live Location Map
      </h2>
      <div style={{ display: "flex", gap: "18px", height: "calc(100vh - 180px)", minHeight: "400px" }}>
        {/* Map */}
        <div ref={mapRef} style={{
          flex: 1, borderRadius: "16px", overflow: "hidden",
          border: "1px solid #f1f5f9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        }} />
        {/* Legend */}
        <div style={{ width: "250px", display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
            Nodes
          </div>
          {dispensers.map(d => (
            <div key={d.id} style={{
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
                  background: d.status === "active" ? "#22c55e" : "#f87171",
                  boxShadow: `0 0 5px ${d.status === "active" ? "#22c55e" : "#f87171"}`,
                }} />
                <span style={{ fontWeight: "700", fontSize: "13px", color: "#0f172a" }}>{d.name}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8" }}>📍 {d.lat}, {d.lng}</div>
              <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
                TDS: <span style={{ color: "#ec4899", fontWeight: "600" }}>{d.sensors.tds} ppm</span>
                &nbsp;|&nbsp;
                pH: <span style={{ color: "#f97316", fontWeight: "600" }}>{d.sensors.phLevel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   CREDENTIALS TAB
═══════════════════════════════════════════════════════════ */
const CredentialsTab = () => {
  const Row = ({ label, value, color }) => (
    <div style={{ marginBottom: "20px" }}>
      <label style={{
        display: "block", fontSize: "11px", fontWeight: "700",
        color: "#94a3b8", textTransform: "uppercase",
        letterSpacing: "0.09em", marginBottom: "8px",
      }}>{label}</label>
      <div style={{
        padding: "13px 16px", borderRadius: "10px",
        background: "#f8fafc", border: "1.5px solid #e2e8f0",
        color: color, fontWeight: "700", fontSize: "15px",
        wordBreak: "break-all", letterSpacing: "0.04em",
      }}>{value}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: "540px" }}>
      <h2 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
        Admin Credentials
      </h2>
      <p style={{ margin: "0 0 28px", fontSize: "13px", color: "#94a3b8" }}>
        These are your fixed admin login details.
      </p>

      <div style={{
        background: "#fff", borderRadius: "18px",
        border: "1px solid #f1f5f9", padding: "28px 28px 8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
      }}>
        <Row label="Admin ID"       value={ADMIN_CREDENTIALS.id}       color="#0369a1"  />
        <Row label="Password"       value={ADMIN_CREDENTIALS.password}  color="#d97706"  />
        <Row label="Recovery / Resend Key" value={RECOVERY_KEY}         color="#7c3aed"  />

        <div style={{
          background: "#fef2f2", border: "1px solid #fca5a5",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "20px",
          fontSize: "12px", color: "#dc2626", display: "flex", gap: "8px",
        }}>
          <span>⚠️</span>
          <span>Keep credentials secure. Do not share with unauthorised personnel.</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN ADMIN PANEL
═══════════════════════════════════════════════════════════ */
const AdminPanel = ({ onClose }) => {
  const [tab, setTab]               = useState("dashboard");
  const [dispensers, setDispensers] = useState(INIT_DISPENSERS);
  const [selected, setSelected]     = useState(INIT_DISPENSERS[0]);

  /* Live sensor refresh */
  useEffect(() => {
    const t = setInterval(() => {
      setDispensers(p => p.map(d => ({ ...d, sensors: genSensors() })));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  /* Keep selected in sync */
  useEffect(() => {
    setSelected(p => dispensers.find(d => d.id === p?.id) || dispensers[0]);
  }, [dispensers]);

  const PAGE_META = {
    dashboard:   { title: "Dashboard",          subtitle: "Real-time sensor data across dispensers" },
    dispensers:  { title: "Dispensers",          subtitle: "Manage dispenser locations" },
    map:         { title: "Live Map",            subtitle: "Geographic view of all nodes" },
    credentials: { title: "Admin Credentials",  subtitle: "Secure account information" },
  };

  const meta = PAGE_META[tab];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex",
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      background: "#f1f5f9",
    }}>
      {/* ── Sidebar ── */}
      <Sidebar active={tab} setActive={setTab} onClose={onClose} />

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar title={meta.title} subtitle={meta.subtitle} />

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: "#f8fafc" }}>
          {tab === "dashboard"   && <DashboardTab dispensers={dispensers} selected={selected} setSelected={setSelected} />}
          {tab === "dispensers"  && <DispensersTab dispensers={dispensers} setDispensers={setDispensers} setSelected={setSelected} setTab={setTab} />}
          {tab === "map"         && <MapTab dispensers={dispensers} />}
          {tab === "credentials" && <CredentialsTab />}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
