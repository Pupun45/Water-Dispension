import React from "react";
import Icon from "./Icon";

const SensorCard = ({ label, value, unit, icon, color }) => (
  <div style={{
    background: "#fff", borderRadius: "16px",
    padding: "22px 20px",
    border: "1px solid #f1f5f9",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    display: "flex", flexDirection: "column", gap: "14px",
    position: "relative", overflow: "hidden",
    transition: "transform 0.2s, box-shadow 0.2s", cursor: "default",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 28px ${color}22`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
  >
    {/* Top colour strip */}
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "3px",
      background: `linear-gradient(90deg, ${color}, ${color}44)`,
    }}/>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{
        width: "42px", height: "42px", borderRadius: "13px",
        background: `${color}14`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}><Icon name={icon} size={20} color={color}/></div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600",
          textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: "4px", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "28px", fontWeight: "800", color, fontVariantNumeric: "tabular-nums" }}>
            {value ?? "—"}
          </span>
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>{unit}</span>
        </div>
      </div>
    </div>
    {/* Decorative circle */}
    <div style={{
      position: "absolute", bottom: "-18px", right: "-18px",
      width: "80px", height: "80px", borderRadius: "50%",
      background: `${color}08`,
    }}/>
  </div>
);

export default SensorCard;
