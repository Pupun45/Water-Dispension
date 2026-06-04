import React, { useState } from "react";

const ADMIN_CREDENTIALS = { id: "admin", password: "Water@2024" };
const RECOVERY_KEY = import.meta.env.VITE_ADMIN_RECOVERY_KEY;
const API_URL = import.meta.env.VITE_API_URL;

/* ─────────────────────────────────────────────────────────── */
/*  Reusable labelled input                                     */
/* ─────────────────────────────────────────────────────────── */
const Field = ({ label, type, value, onChange, placeholder, onKeyDown, right }) => (
  <div style={{ marginBottom: "20px" }}>
    <label style={{
      display: "block",
      fontSize: "11px",
      fontWeight: "700",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#64748b",
      marginBottom: "7px",
    }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: right ? "12px 44px 12px 14px" : "12px 14px",
          fontSize: "14px",
          color: "#1e293b",            /* dark text, always readable */
          background: "#f8fafc",
          border: "1.5px solid #e2e8f0",
          borderRadius: "10px",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          fontFamily: "inherit",
        }}
        onFocus={e => {
          e.target.style.borderColor = "#06b6d4";
          e.target.style.boxShadow = "0 0 0 3px rgba(6,182,212,0.15)";
        }}
        onBlur={e => {
          e.target.style.borderColor = "#e2e8f0";
          e.target.style.boxShadow = "none";
        }}
      />
      {right && (
        <button
          type="button"
          onClick={right.onClick}
          tabIndex={-1}
          style={{
            position: "absolute", right: "12px", top: "50%",
            transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", fontSize: "17px", lineHeight: 1, padding: 0,
          }}
        >
          {right.icon}
        </button>
      )}
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────── */
/*  Animated Water-Drop panel (left side)                      */
/* ─────────────────────────────────────────────────────────── */
const WaterSide = () => (
  <div style={{
    flex: "0 0 45%",
    background: "linear-gradient(145deg, #0c4a6e, #075985, #0369a1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    position: "relative",
    overflow: "hidden",
    borderRadius: "24px 0 0 24px",
  }}>
    {/* Bubbles */}
    {[
      { size: 120, left: "10%", bottom: "8%", delay: "0s", dur: "6s" },
      { size: 80, left: "60%", bottom: "18%", delay: "1.5s", dur: "7.5s" },
      { size: 50, left: "35%", bottom: "5%", delay: "3s", dur: "5.5s" },
      { size: 90, left: "75%", bottom: "40%", delay: "0.8s", dur: "8s" },
      { size: 40, left: "20%", bottom: "55%", delay: "2.2s", dur: "6.5s" },
    ].map((b, i) => (
      <div key={i} style={{
        position: "absolute",
        left: b.left,
        bottom: b.bottom,
        width: b.size,
        height: b.size,
        borderRadius: "50%",
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        animation: `bubbleRise ${b.dur} ${b.delay} ease-in-out infinite`,
      }} />
    ))}

    {/* Big animated water drop */}
    <div style={{
      position: "relative",
      marginBottom: "32px",
      filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
      animation: "dropFloat 3s ease-in-out infinite",
    }}>
      <svg width="140" height="170" viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="dropGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="shineGrad" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Drop body */}
        <path
          d="M50 5 C50 5 15 55 15 75 C15 95 31 110 50 110 C69 110 85 95 85 75 C85 55 50 5 50 5Z"
          fill="url(#dropGrad)"
        />
        {/* Shine */}
        <ellipse cx="38" cy="55" rx="10" ry="18"
          fill="url(#shineGrad)" transform="rotate(-20 38 55)" />
        {/* Ripple ring */}
        <ellipse cx="50" cy="112" rx="30" ry="6"
          fill="rgba(14,165,233,0.25)"
          style={{ animation: "ripple 2s ease-out infinite" }}
        />
      </svg>
    </div>

    <h2 style={{
      margin: "0 0 10px",
      fontSize: "26px",
      fontWeight: "800",
      color: "#fff",
      textAlign: "center",
      letterSpacing: "-0.5px",
    }}>
      AquaAdmin
    </h2>
    <p style={{
      margin: 0,
      fontSize: "13px",
      color: "rgba(255,255,255,0.6)",
      textAlign: "center",
      lineHeight: 1.6,
      maxWidth: "220px",
    }}>
      Smart  Water Dispenser<br /> System
    </p>

    {/* Wave at bottom */}
    <div style={{
      position: "absolute",
      bottom: 0, left: 0, right: 0,
      height: "80px",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "50% 50% 0 0 / 30px 30px 0 0",
    }} />

    <style>{`
      @keyframes dropFloat {
        0%,100% { transform: translateY(0px); }
        50%      { transform: translateY(-14px); }
      }
      @keyframes bubbleRise {
        0%   { transform: translateY(0)   scale(1);   opacity: 0.6; }
        50%  { transform: translateY(-80px) scale(1.1); opacity: 0.4; }
        100% { transform: translateY(-160px) scale(0.8); opacity: 0; }
      }
      @keyframes ripple {
        0%   { rx: 20; opacity: 0.5; }
        100% { rx: 36; opacity: 0; }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────────────────────── */
/*  Main Component                                             */
/* ─────────────────────────────────────────────────────────── */
const LoginModal = ({ onSuccess, onClose }) => {
  const [mode, setMode] = useState("login");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [recoveryError, setRecoveryError] = useState("");
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [recoveredAccounts, setRecoveredAccounts] = useState([]);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: loginId, password }),
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
      } else {
        setError(data.error || "Invalid Admin ID or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to connect to server. Check backend.");
    }
  };

  const handleKeyDown = e => { if (e.key === "Enter") handleLogin(); };

  const handleRecovery = async () => {
    if (recoveryCode.trim() === RECOVERY_KEY) {
      try {
        const res = await fetch(`${API_URL}/admin/accounts`);
        const data = res.ok ? await res.json() : [];
        setRecoveredAccounts(data);
        setRecoverySuccess(true);
        setRecoveryError("");
      } catch (err) {
        console.error("Recovery fetch error:", err);
        setRecoverySuccess(true);
        setRecoveryError("");
      }
    } else {
      setRecoveryError("Invalid recovery key. Please check and try again.");
    }
  };

  const handleResend = () => {
    if (resendCooldown) return;
    setResendCount(c => c + 1);
    setResendCooldown(true);
    setTimeout(() => setResendCooldown(false), 30000);
    alert(`Recovery key (demo):\n${RECOVERY_KEY}`);
  };

  const Err = ({ msg }) => msg ? (
    <div style={{
      background: "#fef2f2", border: "1px solid #fca5a5",
      borderRadius: "10px", padding: "10px 14px",
      fontSize: "13px", color: "#dc2626", marginBottom: "16px",
      display: "flex", alignItems: "center", gap: "8px",
    }}>
      <span>⚠️</span> {msg}
    </div>
  ) : null;

  const PrimaryBtn = ({ onClick, children, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", padding: "13px",
        borderRadius: "12px", border: "none",
        background: disabled
          ? "#e2e8f0"
          : "linear-gradient(135deg, #06b6d4, #3b82f6)",
        color: disabled ? "#94a3b8" : "#fff",
        fontSize: "15px", fontWeight: "700",
        cursor: disabled ? "not-allowed" : "pointer",
        marginBottom: "12px",
        boxShadow: disabled ? "none" : "0 4px 16px rgba(6,182,212,0.3)",
        transition: "all 0.2s",
        fontFamily: "inherit",
      }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.target.style.transform = "translateY(0)"; }}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(8px)",
        zIndex: 10000,
      }} />

      {/* Modal card */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 10001,
        width: "820px",
        maxWidth: "95vw",
        maxHeight: "95vh",
        display: "flex",
        borderRadius: "24px",
        overflow: "hidden",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
        animation: "modalPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}>
        <style>{`
          @keyframes modalPop {
            from { opacity:0; transform:translate(-50%,-46%) scale(0.92); }
            to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
          }
        `}</style>

        {/* ── LEFT: water panel ── */}
        <WaterSide />

        {/* ── RIGHT: form panel ── */}
        <div style={{
          flex: 1,
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 40px",
          position: "relative",
          overflowY: "auto",
        }}>
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: "16px", right: "16px",
              background: "#f1f5f9", border: "none",
              borderRadius: "8px", width: "32px", height: "32px",
              cursor: "pointer", color: "#64748b", fontSize: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>

          {/* ═══ LOGIN MODE ═══ */}
          {mode === "login" && (
            <>
              <div style={{ marginBottom: "32px" }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "26px", fontWeight: "800", color: "#0f172a" }}>
                  Welcome back 👋
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
                  Sign in to your admin account
                </p>
              </div>

              <Field
                label="Admin ID"
                type="text"
                value={loginId}
                onChange={setLoginId}
                placeholder="Enter admin ID"
                onKeyDown={handleKeyDown}
              />
              <Field
                label="Password"
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={setPassword}
                placeholder="Enter password"
                onKeyDown={handleKeyDown}
                right={{ icon: showPwd ? "🙈" : "👁️", onClick: () => setShowPwd(s => !s) }}
              />

              <Err msg={error} />

              <PrimaryBtn onClick={handleLogin}>🔓 Sign In</PrimaryBtn>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => { setMode("forgot"); setError(""); }}
                  style={{
                    background: "none", border: "none",
                    color: "#06b6d4", fontSize: "13px",
                    cursor: "pointer", fontWeight: "600",
                    fontFamily: "inherit",
                  }}
                >
                  Forgot Password?
                </button>
              </div>


            </>
          )}

          {/* ═══ FORGOT PASSWORD MODE ═══ */}
          {mode === "forgot" && !recoverySuccess && (
            <>
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "800", color: "#0f172a" }}>
                  Forgot Password? 🔑
                </h2>
                <p style={{ margin: 0, fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
                  Enter your recovery key to verify your identity.
                </p>
              </div>

              <Field
                label="Recovery Key"
                type="text"
                value={recoveryCode}
                onChange={setRecoveryCode}
                placeholder="Paste your recovery key here"
                onKeyDown={e => { if (e.key === "Enter") handleRecovery(); }}
              />

              <Err msg={recoveryError} />

              <PrimaryBtn onClick={handleRecovery}>✅ Verify Key</PrimaryBtn>

              {/* Resend box */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#f8fafc", borderRadius: "12px",
                padding: "14px 16px", marginBottom: "14px",
                border: "1px solid #e2e8f0",
              }}>
                <div>
                  <div style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                    Didn't receive it?
                  </div>
                  {resendCount > 0 && (
                    <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                      Sent {resendCount}×
                    </div>
                  )}
                </div>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown}
                  style={{
                    padding: "7px 16px", borderRadius: "8px",
                    border: "1.5px solid",
                    borderColor: resendCooldown ? "#e2e8f0" : "#06b6d4",
                    background: resendCooldown ? "#f1f5f9" : "rgba(6,182,212,0.08)",
                    color: resendCooldown ? "#94a3b8" : "#06b6d4",
                    cursor: resendCooldown ? "not-allowed" : "pointer",
                    fontSize: "12px", fontWeight: "700",
                    fontFamily: "inherit",
                    whiteSpace: "nowrap",
                  }}
                >
                  {resendCooldown ? "⏱ Cooldown…" : "📤 Resend Key"}
                </button>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={() => { setMode("login"); setRecoveryError(""); setRecoveryCode(""); }}
                  style={{
                    background: "none", border: "none",
                    color: "#94a3b8", fontSize: "13px",
                    cursor: "pointer", fontFamily: "inherit",
                  }}
                >
                  ← Back to Login
                </button>
              </div>
            </>
          )}

          {/* ═══ RECOVERY SUCCESS ═══ */}
          {mode === "forgot" && recoverySuccess && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "56px", marginBottom: "12px" }}>🎉</div>
              <h3 style={{ margin: "0 0 8px", fontSize: "20px", fontWeight: "800", color: "#16a34a" }}>
                Identity Verified!
              </h3>
              <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b" }}>
                Your credentials have been recovered.
              </p>

              <div style={{
                background: "#f0fdf4", border: "1px solid #bbf7d0",
                borderRadius: "14px", padding: "20px",
                marginBottom: "24px", textAlign: "left",
                maxHeight: "180px", overflowY: "auto",
              }}>
                {recoveredAccounts.map((acc, idx) => (
                  <div key={idx} style={{ marginBottom: idx === recoveredAccounts.length - 1 ? 0 : "14px" }}>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>
                      Admin ID ({idx === 0 ? "Primary" : `Account #${idx + 1}`})
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#0369a1", marginBottom: "4px" }}>{acc.id}</div>
                    <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "2px" }}>Password</div>
                    <div style={{ fontSize: "14px", fontWeight: "700", color: "#d97706" }}>{acc.password}</div>
                  </div>
                ))}
                {recoveredAccounts.length === 0 && (
                  <div>
                    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Admin ID</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#0369a1", marginBottom: "12px" }}>{ADMIN_CREDENTIALS.id}</div>
                    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Password</div>
                    <div style={{ fontSize: "16px", fontWeight: "700", color: "#d97706" }}>{ADMIN_CREDENTIALS.password}</div>
                  </div>
                )}
              </div>

              <PrimaryBtn onClick={() => { setMode("login"); setRecoverySuccess(false); setRecoveryCode(""); }}>
                Go to Login →
              </PrimaryBtn>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;
