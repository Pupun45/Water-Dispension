import React from "react";
import Icon from "./Icon";

const CYAN = "#06b6d4";

const TopBar = ({ title, subtitle, dispenserName }) => (
  <div style={{
    height: "64px", flexShrink: 0,
    background: "#fff", borderBottom: "1px solid #f1f5f9",
    display: "flex", alignItems: "center",
    padding: "0 28px", justifyContent: "space-between",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  }}>
    <div>
      <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>{title}</h1>
      <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
        {dispenserName
          ? <><span style={{ color: CYAN, fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}><Icon name="pin" size={12} color={CYAN}/> {dispenserName}</span> — {subtitle}</>
          : subtitle}
      </p>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "5px 12px", borderRadius: "20px",
        background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)",
      }}>
        <div style={{
          width: "7px", height: "7px", borderRadius: "50%",
          background: "#22c55e", animation: "pulseDot 2s infinite",
        }}/>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#16a34a" }}>Live</span>
      </div>
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

export default TopBar;
