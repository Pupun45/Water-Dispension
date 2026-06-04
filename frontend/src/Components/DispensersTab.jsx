import React from "react";

const CYAN = "#06b6d4";

const DispensersTab = ({ tanks, onRefresh, setSelected, setTab }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
      <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Dispenser Locations</h2>
      <button onClick={onRefresh} style={{
        padding: "9px 20px", borderRadius: "10px",
        border: `1.5px solid ${CYAN}`,
        background: "#fff", color: CYAN,
        cursor: "pointer", fontWeight: "700",
        fontSize: "13px", transition: "all 0.18s", fontFamily: "inherit",
      }}>🔄 Refresh</button>
    </div>

    <div style={{
      background: "#fff", borderRadius: "16px",
      border: "1px solid #f1f5f9",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      overflow: "hidden",
    }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["#", "Dispenser ID", "Name", "Capacity", "Remaining", "TDS", "pH", "Level %", "Status", "View"].map(h => (
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
          {tanks.length === 0 && (
            <tr>
              <td colSpan={10} style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                No dispensers found. Use POST /tank to add one.
              </td>
            </tr>
          )}
          {tanks.map((t, i) => {
            const pct = t.tank_capacity > 0
              ? ((t.remaining / t.tank_capacity) * 100).toFixed(1)
              : "—";
            const isLow = t.remaining / (t.tank_capacity || 1) < 0.2;
            return (
              <tr key={t._id}
                style={{ borderTop: "1px solid #f8fafc", cursor: "pointer" }}
                onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                onMouseLeave={e => e.currentTarget.style.background = ""}
                onClick={() => { setSelected(t); setTab("dashboard"); }}
              >
                <td style={{ padding: "13px 16px", color: "#cbd5e1", fontSize: "13px" }}>{i + 1}</td>
                <td style={{ padding: "13px 16px", color: "#94a3b8", fontSize: "11px", fontFamily: "monospace" }}>{t._id.slice(-8)}</td>
                <td style={{ padding: "13px 16px", color: "#0f172a", fontWeight: "700", fontSize: "14px" }}>
                  {t.name || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>unnamed</span>}
                </td>
                <td style={{ padding: "13px 16px", color: "#64748b", fontSize: "13px" }}>{t.tank_capacity} L</td>
                <td style={{ padding: "13px 16px", color: isLow ? "#dc2626" : "#16a34a", fontWeight: "700", fontSize: "13px" }}>
                  {t.remaining} L {isLow && "⚠️"}
                </td>
                <td style={{ padding: "13px 16px", color: "#ec4899", fontWeight: "600", fontSize: "13px" }}>{t.tds ?? "—"} ppm</td>
                <td style={{ padding: "13px 16px", color: "#f97316", fontWeight: "600", fontSize: "13px" }}>{t.ph_level ?? "—"}</td>
                <td style={{ padding: "13px 16px", color: CYAN, fontWeight: "600", fontSize: "13px" }}>{t.water_level ?? pct}%</td>
                <td style={{ padding: "13px 16px" }}>
                  <span style={{
                    padding: "3px 10px", borderRadius: "20px",
                    fontSize: "11px", fontWeight: "700",
                    background: t.remaining > 0 ? "#dcfce7" : "#fee2e2",
                    color: t.remaining > 0 ? "#16a34a" : "#dc2626",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>{t.remaining > 0 ? "active" : "empty"}</span>
                </td>
                <td style={{ padding: "13px 16px" }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => { setSelected(t); setTab("dashboard"); }} style={{
                    padding: "5px 12px", borderRadius: "7px",
                    border: `1px solid ${CYAN}55`, background: `${CYAN}11`,
                    color: CYAN, cursor: "pointer", fontSize: "12px",
                    fontWeight: "600", fontFamily: "inherit",
                  }}>View →</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export default DispensersTab;
