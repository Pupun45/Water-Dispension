import React from "react";
import Icon from "./Icon";
import SensorCard from "./SensorCard";
import BarChart from "./BarChart";

const CYAN = "#06b6d4";

const DashboardTab = ({ tanks, selected, setSelected, history, savedId, onSave }) => {
  const tank = selected || {};
  const hist = history[tank._id] || [];

  const saved    = tanks.find(t => t._id === savedId);
  const isSaved  = savedId === selected?._id;

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>

      {/* ══ LEFT PANEL — dropdown + save ══ */}
      <div style={{
        width: "230px", flexShrink: 0,
        background: "#fff", borderRadius: "18px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        padding: "22px 18px",
        display: "flex", flexDirection: "column", gap: "18px",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "10px",
            background: `linear-gradient(135deg, ${CYAN}22, #3b82f622)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="layers" size={18} color={CYAN}/></div>
          <div>
            <div style={{ fontWeight: "800", fontSize: "13px", color: "#0f172a" }}>Dispenser</div>
            <div style={{ fontSize: "10px", color: "#94a3b8" }}>Select &amp; save active</div>
          </div>
        </div>

        {/* Dropdown */}
        <div>
          <label style={{
            display: "block", fontSize: "10px", fontWeight: "700",
            color: "#94a3b8", textTransform: "uppercase",
            letterSpacing: "0.09em", marginBottom: "7px",
          }}>Choose dispenser</label>
          <div style={{ position: "relative" }}>
            <select
              value={selected?._id || ""}
              onChange={e => {
                const t = tanks.find(x => x._id === e.target.value);
                if (t) setSelected(t);
              }}
              style={{
                width: "100%", padding: "10px 36px 10px 12px",
                borderRadius: "10px", border: `1.5px solid ${selected ? CYAN + "66" : "#e2e8f0"}`,
                background: "#f8fafc", color: "#0f172a",
                fontSize: "13px", fontWeight: "600",
                cursor: "pointer", outline: "none",
                appearance: "none", fontFamily: "inherit",
                boxShadow: selected ? `0 0 0 3px ${CYAN}18` : "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            >
              {tanks.length === 0 && (
                <option value="">No dispensers found</option>
              )}
              {tanks.map(t => (
                <option key={t._id} value={t._id}>
                  {t.name || `Dispenser #${t._id.slice(-5)}`}
                  {savedId === t._id ? " ✅" : ""}
                </option>
              ))}
            </select>
            {/* Custom arrow */}
            <div style={{
              position: "absolute", right: "11px", top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none",
              color: CYAN, fontSize: "12px",
            }}>▾</div>
          </div>
        </div>

        {/* Status badge */}
        {selected && (
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "9px 12px", borderRadius: "10px",
            background: selected.remaining > 0 ? "#f0fdf4" : "#fef2f2",
            border: `1px solid ${selected.remaining > 0 ? "#86efac" : "#fca5a5"}`,
          }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
              background: selected.remaining > 0 ? "#22c55e" : "#f87171",
              boxShadow: `0 0 5px ${selected.remaining > 0 ? "#22c55e" : "#f87171"}`,
            }}/>
            <span style={{
              fontSize: "12px", fontWeight: "700",
              color: selected.remaining > 0 ? "#15803d" : "#dc2626",
            }}>
              {selected.remaining > 0 ? "Active" : "Empty"}
            </span>
            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#94a3b8" }}>
              {selected.remaining} L
            </span>
          </div>
        )}

        {/* Save button */}
        {selected && (
          <button
            onClick={() => onSave(selected._id, selected.name || `Dispenser #${selected._id.slice(-5)}`)}
            style={{
              width: "100%", padding: "11px 16px",
              borderRadius: "12px",
              border: isSaved ? "2px solid #22c55e" : `2px solid ${CYAN}`,
              background: isSaved
                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                : `linear-gradient(135deg, ${CYAN}, #3b82f6)`,
              color: "#fff",
              fontSize: "13px", fontWeight: "800",
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: isSaved
                ? "0 4px 14px rgba(34,197,94,0.35)"
                : `0 4px 14px ${CYAN}44`,
              transition: "all 0.22s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.filter = "brightness(1.08)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.filter = "none"; }}
          >
            {isSaved ? "✅ Saved as Active" : "💾 Save as Active"}
          </button>
        )}

        {/* Saved notice */}
        {saved && !isSaved && (
          <div style={{
            fontSize: "11px", color: "#15803d",
            background: "#f0fdf4", border: "1px solid #86efac",
            borderRadius: "9px", padding: "8px 12px",
            fontWeight: "600", display: "flex", gap: "6px", alignItems: "flex-start",
          }}>
            <span>📍</span>
            <span>Active: <strong>{saved.name || `Dispenser #${saved._id.slice(-5)}`}</strong></span>
          </div>
        )}

        {/* Dispenser list summary */}
        <div>
          <div style={{
            fontSize: "10px", fontWeight: "700", color: "#94a3b8",
            textTransform: "uppercase", letterSpacing: "0.09em",
            marginBottom: "8px",
          }}>All Dispensers</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {tanks.map(t => (
              <div
                key={t._id}
                onClick={() => setSelected(t)}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "7px 10px", borderRadius: "9px",
                  cursor: "pointer",
                  background: selected?._id === t._id ? `${CYAN}12` : "transparent",
                  border: selected?._id === t._id ? `1px solid ${CYAN}44` : "1px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (selected?._id !== t._id) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (selected?._id !== t._id) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                  background: t.remaining > 0 ? "#22c55e" : "#f87171",
                }}/>
                <span style={{
                  fontSize: "12px", fontWeight: selected?._id === t._id ? "700" : "500",
                  color: selected?._id === t._id ? CYAN : "#64748b",
                  flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {t.name || `#${t._id.slice(-5)}`}
                </span>
                {savedId === t._id && (
                  <span style={{
                    fontSize: "8px", background: "#22c55e", color: "#fff",
                    padding: "1px 5px", borderRadius: "20px", fontWeight: "800",
                  }}>ACTIVE</span>
                )}
              </div>
            ))}
            {tanks.length === 0 && (
              <div style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>
                No dispensers yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — sensor cards (top) + chart (bottom) ══ */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {selected ? (
          <>
            {/* Sensor cards grid — TOP */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(210px,1fr))", gap: "16px", marginBottom: "28px" }}>
              <SensorCard label="Water Level"   value={tank.water_level}  unit="%"     icon="drop"        color={CYAN}/>
              <SensorCard label="Remaining"     value={tank.remaining}    unit="L"     icon="container"   color="#3b82f6"/>
              <SensorCard label="TDS"           value={tank.tds}          unit="ppm"   icon="flask"        color="#ec4899"/>
              <SensorCard label="pH Level"      value={tank.ph_level}     unit=""      icon="ph"           color="#f97316"/>
              <SensorCard label="Turbidity"     value={tank.turbidity}    unit="NTU"   icon="turbidity"    color="#8b5cf6"/>
              <SensorCard label="Dissolved O₂" value={tank.dissolved_o2} unit="mg/L"  icon="oxygen"       color="#10b981"/>
              <SensorCard label="Water Temp"    value={tank.water_temp}   unit="°C"    icon="thermometer"  color="#0ea5e9"/>
              <SensorCard label="Env. Temp"     value={tank.env_temp}     unit="°C"    icon="sun"          color="#f59e0b"/>
            </div>

            {/* Bar chart — BOTTOM */}
            <BarChart tank={tank}/>

            <p style={{ marginTop: "8px", fontSize: "12px", color: "#cbd5e1" }}>
              ⟳ Live data refreshes every 5 seconds
            </p>
          </>
        ) : (
          <div style={{
            textAlign: "center", padding: "80px 0",
            color: "#94a3b8", fontSize: "14px",
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", opacity: 0.3 }}><Icon name="layers" size={48} color="#94a3b8"/></div>
            Select a dispenser on the left to view its sensor data
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;
