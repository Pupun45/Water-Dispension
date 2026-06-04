import React from "react";
import Icon from "./Icon";

const BG = "linear-gradient(135deg, rgb(10,15,30) 0%, rgb(13,27,42) 50%, rgb(10,25,47) 100%)";
const CYAN = "#06b6d4";
const SIDEBAR_W = "240px";

const NAV = [
  { key: "dashboard",   label: "Dashboard",   icon: "dashboard" },
  { key: "dispensers",  label: "Dispensers",  icon: "dispensers" },
  { key: "map",         label: "Live Map",    icon: "map" },
  { key: "credentials", label: "Credentials", icon: "credentials" },
];

const Sidebar = ({ active, setActive, onClose }) => (
  <aside style={{
    width: SIDEBAR_W, flexShrink: 0, background: BG,
    display: "flex", flexDirection: "column",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    overflow: "hidden", position: "relative",
  }}>
    <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "12px",
          background: `linear-gradient(135deg, ${CYAN}, #3b82f6)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: `0 4px 14px rgba(6,182,212,0.35)`,
        }}><Icon name="water" size={22} color="#fff"/></div>
        <div>
          <div style={{ color: "#fff", fontWeight: "800", fontSize: "15px", letterSpacing: "-0.3px" }}>Water Admin</div>
        </div>
      </div>
    </div>

    <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
      <div style={{
        fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em",
        color: "rgba(255,255,255,0.28)", textTransform: "uppercase",
        padding: "0 12px", marginBottom: "8px",
      }}>Navigation</div>
      {NAV.map(n => {
        const isActive = active === n.key;
        return (
          <button key={n.key} onClick={() => setActive(n.key)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: "12px",
            padding: "11px 14px", borderRadius: "10px", border: "none",
            cursor: "pointer",
            background: isActive ? "rgba(255,255,255,0.10)" : "transparent",
            color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
            fontSize: "14px", fontWeight: isActive ? "700" : "500",
            textAlign: "left", transition: "all 0.18s",
            position: "relative", fontFamily: "inherit",
          }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
          >
            {isActive && <div style={{
              position: "absolute", left: 0, top: "20%", bottom: "20%",
              width: "3px", borderRadius: "0 3px 3px 0", background: CYAN,
            }}/>}
            <span style={{ display: "flex", alignItems: "center", lineHeight: 1 }}><Icon name={n.icon} size={17} color={isActive ? "#fff" : "rgba(255,255,255,0.5)"}/></span>
            <span>{n.label}</span>
            {isActive && <span style={{
              marginLeft: "auto", width: "6px", height: "6px",
              borderRadius: "50%", background: CYAN, boxShadow: `0 0 6px ${CYAN}`,
            }}/>}
          </button>
        );
      })}
    </nav>

    <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <button onClick={onClose} style={{
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
        <Icon name="logout" size={17} color="#f87171"/> Exit Panel
      </button>
    </div>
  </aside>
);

export default Sidebar;
