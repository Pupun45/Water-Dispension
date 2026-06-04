import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import DashboardTab from "./DashboardTab";
import DispensersTab from "./DispensersTab";
import MapTab from "./MapTab";
import CredentialsTab from "./CredentialsTab";

/* ─── Constants ─────────────────────────────────────────── */
const API_URL = import.meta.env.VITE_API_URL;
const MAX_HISTORY = 20;

/* ─── Sparkline helpers ─────────────────────────────────── */
function addHistory(prev, tank) {
  const id = tank._id;
  const old = prev[id] || [];
  const point = {
    t:           Date.now(),
    tds:         tank.tds          ?? 0,
    ph_level:    tank.ph_level     ?? 0,
    turbidity:   tank.turbidity    ?? 0,
    dissolved_o2:tank.dissolved_o2 ?? 0,
    water_temp:  tank.water_temp   ?? 0,
    env_temp:    tank.env_temp     ?? 0,
    water_level: tank.water_level  ?? 0,
    remaining:   tank.remaining    ?? 0,
  };
  return { ...prev, [id]: [...old.slice(-(MAX_HISTORY - 1)), point] };
}

/* ═══════════════════════════════════════════════════════════
   MAIN ADMIN PANEL
   (Coordinates all modular tabs and fetches real-time data)
   ═══════════════════════════════════════════════════════════ */
const AdminPanel = ({ onClose }) => {
  const [tab,      setTab]      = useState("dashboard");
  const [tanks,    setTanks]    = useState([]);
  const [selected, setSelected] = useState(null);
  const [history,  setHistory]  = useState({});   // { tankId: [{t, tds, ph_level, ...}] }

  // savedId / savedName — persisted to localStorage → read by App.jsx for user UI
  const [savedId,   setSavedId]   = useState(() => localStorage.getItem("activeTankId")   || "");
  const [savedName, setSavedName] = useState(() => localStorage.getItem("activeTankName") || "");

  /* ── Fetch all tanks ── */
  const fetchTanks = async () => {
    try {
      const res  = await fetch(`${API_URL}/tank`);
      const data = await res.json();
      if (!Array.isArray(data)) return;
      setTanks(data);
      // Append history snapshot
      setHistory(prev => {
        let next = { ...prev };
        data.forEach(t => { next = addHistory(next, t); });
        return next;
      });
      // Keep selected in sync
      setSelected(prev => {
        if (!prev && data.length > 0) return data[0];
        return data.find(t => t._id === prev?._id) || prev;
      });
    } catch (e) {
      console.error("Failed to fetch tanks:", e);
    }
  };

  /* Auto-refresh every 5 s */
  useEffect(() => {
    fetchTanks();
    const t = setInterval(fetchTanks, 5000);
    return () => clearInterval(t);
  }, []);

  /* ── Save active dispenser ── */
  const handleSave = (id, name) => {
    localStorage.setItem("activeTankId",   id);
    localStorage.setItem("activeTankName", name);
    setSavedId(id);
    setSavedName(name);
    // Dispatch storage event so App.jsx picks it up in the same tab
    window.dispatchEvent(new Event("storage"));
  };

  const PAGE_META = {
    dashboard:   { title: "Dashboard",         subtitle: "Real-time sensor data" },
    dispensers:  { title: "Dispensers",         subtitle: "Manage dispenser locations" },
    map:         { title: "Live Map",           subtitle: "Geographic view of all nodes" },
    credentials: { title: "Admin Credentials", subtitle: "Secure account information" },
  };
  const meta = PAGE_META[tab];

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      display: "flex",
      fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      background: "#f1f5f9",
    }}>
      <Sidebar active={tab} setActive={setTab} onClose={onClose}/>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          dispenserName={tab === "dashboard" && selected
            ? (selected.name || `Dispenser #${selected._id?.slice(-5)}`)
            : ""}
        />

        <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px", background: "#f8fafc" }}>
          {tab === "dashboard" && (
            <DashboardTab
              tanks={tanks}
              selected={selected}
              setSelected={setSelected}
              history={history}
              savedId={savedId}
              onSave={handleSave}
            />
          )}
          {tab === "dispensers" && (
            <DispensersTab
              tanks={tanks}
              onRefresh={fetchTanks}
              setSelected={setSelected}
              setTab={setTab}
            />
          )}
          {tab === "map"         && <MapTab tanks={tanks}/>}
          {tab === "credentials" && <CredentialsTab/>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
