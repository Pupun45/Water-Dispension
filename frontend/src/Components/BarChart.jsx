import React from "react";
import Icon from "./Icon";

const CYAN = "#06b6d4";

const BAR_METRICS = [
  { key: "water_level",  label: "Water Level",  unit: "%",    color: "#06b6d4", max: 100 },
  { key: "remaining",    label: "Remaining",    unit: "L",    color: "#3b82f6", max: 500 },
  { key: "tds",          label: "TDS",          unit: "ppm",  color: "#ec4899", max: 1000 },
  { key: "ph_level",     label: "pH",           unit: "",     color: "#f97316", max: 14 },
  { key: "turbidity",    label: "Turbidity",    unit: "NTU",  color: "#8b5cf6", max: 100 },
  { key: "dissolved_o2", label: "Dissolved O₂", unit: "mg/L", color: "#10b981", max: 20 },
  { key: "water_temp",   label: "Water Temp",   unit: "°C",   color: "#0ea5e9", max: 60 },
  { key: "env_temp",     label: "Env Temp",     unit: "°C",   color: "#f59e0b", max: 60 },
];

const BarChart = ({ tank }) => {
  const [hovered, setHovered] = React.useState(null);
  const W = 560, H = 260, PAD_L = 44, PAD_B = 54, PAD_T = 24, PAD_R = 18;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const n = BAR_METRICS.length;
  const gap = 10;
  const barW = (chartW - gap * (n - 1)) / n;

  return (
    <div style={{
      background: "#fff", borderRadius: "18px",
      border: "1px solid #f1f5f9",
      boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
      padding: "22px 24px 16px",
      marginBottom: "28px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "linear-gradient(135deg, #06b6d411, #3b82f611)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Icon name="barchart" size={18} color={CYAN}/></div>
        <div>
          <div style={{ fontWeight: "800", fontSize: "15px", color: "#0f172a" }}>Sensor Overview</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Current readings — hover bars for details</div>
        </div>
      </div>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block", overflow: "visible" }}>
        <defs>
          {BAR_METRICS.map(m => (
            <linearGradient key={m.key} id={`bg-${m.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={m.color} stopOpacity="0.95"/>
              <stop offset="100%" stopColor={m.color} stopOpacity="0.55"/>
            </linearGradient>
          ))}
        </defs>

        {/* Y grid lines */}
        {[0, 25, 50, 75, 100].map(pct => {
          const y = PAD_T + chartH - (pct / 100) * chartH;
          return (
            <g key={pct}>
              <line x1={PAD_L} y1={y} x2={PAD_L + chartW} y2={y}
                stroke="#f1f5f9" strokeWidth="1" strokeDasharray={pct === 0 ? "none" : "4 3"}/>
              <text x={PAD_L - 6} y={y + 4} textAnchor="end"
                fontSize="9" fill="#cbd5e1" fontFamily="inherit">{pct}%</text>
            </g>
          );
        })}

        {/* Bars */}
        {BAR_METRICS.map((m, i) => {
          const raw = tank[m.key] ?? 0;
          const pct = Math.min(raw / m.max, 1);
          const bH  = Math.max(pct * chartH, pct > 0 ? 4 : 0);
          const x   = PAD_L + i * (barW + gap);
          const y   = PAD_T + chartH - bH;
          const isH = hovered === m.key;

          return (
            <g key={m.key}
              onMouseEnter={() => setHovered(m.key)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}>

              {/* hover hit area */}
              <rect x={x} y={PAD_T} width={barW} height={chartH}
                fill="transparent"/>

              {/* bar background track */}
              <rect x={x} y={PAD_T} width={barW} height={chartH}
                fill={isH ? `${m.color}08` : "transparent"} rx="6"/>

              {/* bar */}
              <rect x={x} y={y} width={barW} height={bH}
                fill={`url(#bg-${m.key})`} rx="5"
                style={{ transition: "all 0.3s ease" }}
                filter={isH ? `drop-shadow(0 4px 8px ${m.color}55)` : "none"}/>

              {/* value label on top */}
              {pct > 0 && (
                <text x={x + barW / 2} y={y - 5} textAnchor="middle"
                  fontSize="9" fontWeight="700" fill={m.color} fontFamily="inherit">
                  {raw}{m.unit}
                </text>
              )}

              {/* X label */}
              <text x={x + barW / 2} y={PAD_T + chartH + 16} textAnchor="middle"
                fontSize="9" fill={isH ? m.color : "#94a3b8"}
                fontWeight={isH ? "700" : "500"} fontFamily="inherit">
                {m.label}
              </text>
              <text x={x + barW / 2} y={PAD_T + chartH + 28} textAnchor="middle"
                fontSize="8" fill="#cbd5e1" fontFamily="inherit">
                {m.unit || "—"}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hovered && (() => {
          const m   = BAR_METRICS.find(x => x.key === hovered);
          const raw = tank[m.key] ?? "—";
          const i   = BAR_METRICS.findIndex(x => x.key === hovered);
          const tx  = Math.min(PAD_L + i * (barW + gap) + barW / 2, W - 80);
          const pct = Math.min((raw / m.max) * 100, 100).toFixed(1);
          const ty  = PAD_T - 4;
          return (
            <g>
              <rect x={tx - 44} y={ty - 30} width={88} height={28} rx="7"
                fill="#0f172a" opacity="0.92"/>
              <text x={tx} y={ty - 19} textAnchor="middle"
                fontSize="10" fontWeight="800" fill="#fff" fontFamily="inherit">
                {m.label}: {raw}{m.unit}
              </text>
              <text x={tx} y={ty - 8} textAnchor="middle"
                fontSize="8" fill="#94a3b8" fontFamily="inherit">
                {pct}% of max ({m.max})
              </text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};

export default BarChart;
