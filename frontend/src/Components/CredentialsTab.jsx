import React from "react";
import Icon from "./Icon";

const CYAN = "#06b6d4";
const API_URL = import.meta.env.VITE_API_URL;

const CredentialsTab = () => {
  /* ── State ── */
  const [accounts, setAccounts] = React.useState([]);

  // editing state per row
  const [editing, setEditing] = React.useState(null); // index of row being edited
  const [editId,  setEditId]  = React.useState("");
  const [editPwd, setEditPwd] = React.useState("");
  const [showPwd, setShowPwd] = React.useState({}); // { index: bool }

  // new account form
  const [newId,    setNewId]    = React.useState("");
  const [newPwd,   setNewPwd]   = React.useState("");
  const [newPwdVis,setNewPwdVis]= React.useState(false);

  // feedback toast
  const [toast, setToast] = React.useState(null);

  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchAccounts = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/accounts`);
      if (res.ok) {
        const data = await res.json();
        setAccounts(data);
      }
    } catch (err) {
      console.error("Failed to fetch admin accounts:", err);
    }
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  /* ── Save edit ── */
  const saveEdit = async (idx) => {
    const trimId  = editId.trim();
    const trimPwd = editPwd.trim();
    if (!trimId || !trimPwd) return showToast("ID and Password cannot be empty.", false);
    
    const targetAccount = accounts[idx];
    try {
      const res = await fetch(`${API_URL}/admin/accounts/${targetAccount.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newId: trimId, password: trimPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAccounts();
        setEditing(null);
        showToast("Credentials updated successfully.");
      } else {
        showToast(data.error || "Failed to update credentials.", false);
      }
    } catch (err) {
      console.error(err);
      showToast("Error connecting to server.", false);
    }
  };

  /* ── Delete account ── */
  const deleteAccount = async (idx) => {
    if (accounts.length === 1) return showToast("Cannot delete the last admin account.", false);
    const targetAccount = accounts[idx];
    if (!window.confirm(`Delete account "${targetAccount.id}"?`)) return;
    
    try {
      const res = await fetch(`${API_URL}/admin/accounts/${targetAccount.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        fetchAccounts();
        showToast("Account deleted.");
      } else {
        showToast(data.error || "Failed to delete account.", false);
      }
    } catch (err) {
      console.error(err);
      showToast("Error connecting to server.", false);
    }
  };

  /* ── Add new account ── */
  const addAccount = async () => {
    const trimId  = newId.trim();
    const trimPwd = newPwd.trim();
    if (!trimId || !trimPwd) return showToast("Fill in both ID and Password.", false);
    
    try {
      const res = await fetch(`${API_URL}/admin/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: trimId, password: trimPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchAccounts();
        setNewId(""); setNewPwd("");
        showToast("New account created successfully.");
      } else {
        showToast(data.error || "Failed to create account.", false);
      }
    } catch (err) {
      console.error(err);
      showToast("Error connecting to server.", false);
    }
  };

  /* ── Styles ── */
  const inputSt = (focus) => ({
    width: "100%", padding: "10px 14px", borderRadius: "10px",
    border: `1.5px solid ${focus ? CYAN : "#e2e8f0"}`,
    background: "#f8fafc", color: "#0f172a",
    fontSize: "14px", fontWeight: "600",
    outline: "none", fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.18s",
  });

  const btnSt = (variant = "primary") => ({
    padding: "8px 18px", borderRadius: "9px",
    border: "none", cursor: "pointer",
    fontSize: "12px", fontWeight: "700",
    fontFamily: "inherit",
    transition: "all 0.18s",
    ...(variant === "primary"  && { background: CYAN,      color: "#fff" }),
    ...(variant === "success"  && { background: "#22c55e", color: "#fff" }),
    ...(variant === "danger"   && { background: "#fee2e2", color: "#dc2626", border: "1px solid #fca5a5" }),
    ...(variant === "ghost"    && { background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0" }),
  });

  return (
    <div style={{ width: "100%", maxWidth: "1100px" }}>
      {/* ── Toast ── */}
      {toast && (
        <div style={{
          position: "fixed", top: "24px", right: "32px", zIndex: 99999,
          background: toast.ok ? "#f0fdf4" : "#fef2f2",
          border: `1.5px solid ${toast.ok ? "#86efac" : "#fca5a5"}`,
          color: toast.ok ? "#15803d" : "#dc2626",
          borderRadius: "12px", padding: "12px 20px",
          fontWeight: "700", fontSize: "13px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          {toast.ok ? "✅" : "⚠️"} {toast.msg}
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 6px", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>
          Admin Credentials
        </h2>
        <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8" }}>
          Manage admin login accounts stored securely in MongoDB.
        </p>
      </div>

      <div style={{ display: "flex", gap: "32px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* ── LEFT COLUMN: Create New Account Form ── */}
        <div style={{
          flex: "1 1 380px",
          background: "#fff",
          borderRadius: "18px",
          border: "1.5px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
        }}>
          <h3 style={{ margin: "0 0 20px", fontSize: "15px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>➕</span> Create Admin Account
          </h3>

          {/* New ID */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700",
              color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: "6px" }}>
              Admin ID
            </label>
            <input
              style={inputSt(false)}
              value={newId}
              onChange={e => setNewId(e.target.value)}
              placeholder="e.g. admin2"
            />
          </div>

          {/* New Password */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: "700",
              color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em",
              marginBottom: "6px" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputSt(false), paddingRight: "44px" }}
                type={newPwdVis ? "text" : "password"}
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                placeholder="Enter password"
                onKeyDown={e => e.key === "Enter" && addAccount()}
              />
              <button
                onClick={() => setNewPwdVis(v => !v)}
                style={{
                  position: "absolute", right: "12px", top: "50%",
                  transform: "translateY(-50%)",
                  background: "none", border: "none",
                  cursor: "pointer", fontSize: "16px", color: "#94a3b8",
                }}
              >
                {newPwdVis ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button 
            style={{
              ...btnSt("primary"), 
              width: "100%", 
              padding: "12px", 
              fontSize: "14px", 
              borderRadius: "10px",
              boxShadow: `0 4px 14px ${CYAN}44`
            }} 
            onClick={addAccount}
          >
            Create Account
          </button>
        </div>

        {/* ── RIGHT COLUMN: Show list and delete button ── */}
        <div style={{ flex: "1.5 1 500px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <h3 style={{ margin: "0 0 4px", fontSize: "15px", fontWeight: "800", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>👥</span> Admin Accounts List ({accounts.length})
          </h3>
          <p style={{ margin: "0 0 6px", fontSize: "12px", color: "#94a3b8" }}>
            Below are all active administrator accounts. Use the toggle to view passwords, edit credentials, or delete.
          </p>

          {accounts.map((acc, idx) => {
            const isEditing = editing === idx;
            const pwdVisible = showPwd[idx];
            return (
              <div key={idx} style={{
                background: "#fff", borderRadius: "16px",
                border: isEditing ? `2px solid ${CYAN}` : "1.5px solid #e2e8f0",
                padding: "20px 22px",
                boxShadow: isEditing ? `0 0 0 3px ${CYAN}18` : "0 2px 8px rgba(0,0,0,0.03)",
                transition: "border-color 0.18s, box-shadow 0.18s",
              }}>
                {/* Row header */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: isEditing ? "18px" : 0 }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "9px",
                    background: `linear-gradient(135deg, ${CYAN}, #3b82f6)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon name="credentials" size={16} color="#fff"/>
                  </div>
                  <div style={{ flex: 1 }}>
                    {!isEditing && (
                      <div style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>
                        {acc.id}
                      </div>
                    )}
                    {!isEditing && (
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
                        {idx === 0 ? "Primary account" : `Account #${idx + 1}`}
                      </div>
                    )}
                    {isEditing && (
                      <span style={{ fontSize: "12px", fontWeight: "700", color: CYAN }}>
                        Editing credentials
                      </span>
                    )}
                  </div>
                  {/* Action buttons */}
                  {!isEditing && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button style={btnSt("ghost")} onClick={() => {
                        setEditing(idx); setEditId(acc.id); setEditPwd(acc.password);
                      }}>
                        ✏️ Edit
                      </button>
                      {accounts.length > 1 && (
                        <button style={btnSt("danger")} onClick={() => deleteAccount(idx)}>
                          🗑 Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit form */}
                {isEditing && (
                  <div>
                    {/* Admin ID */}
                    <div style={{ marginBottom: "14px" }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700",
                        color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em",
                        marginBottom: "6px" }}>
                        Admin ID
                      </label>
                      <input
                        style={inputSt(true)}
                        value={editId}
                        onChange={e => setEditId(e.target.value)}
                        placeholder="Enter new admin ID"
                        autoFocus
                      />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: "18px" }}>
                      <label style={{ display: "block", fontSize: "11px", fontWeight: "700",
                        color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em",
                        marginBottom: "6px" }}>
                        Password
                      </label>
                      <div style={{ position: "relative" }}>
                        <input
                          style={{ ...inputSt(true), paddingRight: "44px" }}
                          type={pwdVisible ? "text" : "password"}
                          value={editPwd}
                          onChange={e => setEditPwd(e.target.value)}
                          placeholder="Enter new password"
                          onKeyDown={e => e.key === "Enter" && saveEdit(idx)}
                        />
                        <button
                          onClick={() => setShowPwd(p => ({ ...p, [idx]: !p[idx] }))}
                          style={{
                            position: "absolute", right: "12px", top: "50%",
                            transform: "translateY(-50%)",
                            background: "none", border: "none",
                            cursor: "pointer", fontSize: "16px", color: "#94a3b8",
                          }}
                        >
                          {pwdVisible ? "🙈" : "👁"}
                        </button>
                      </div>
                    </div>

                    {/* Action row */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button style={btnSt("success")} onClick={() => saveEdit(idx)}>
                        ✅ Save Changes
                      </button>
                      <button style={btnSt("ghost")} onClick={() => setEditing(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Display (non-editing) */}
                {!isEditing && (
                  <div style={{ display: "flex", gap: "24px", marginTop: "12px",
                    paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                        Admin ID
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "700", color: "#0369a1" }}>
                        {acc.id}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>
                        Password
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#d97706",
                          letterSpacing: pwdVisible ? "0" : "0.12em" }}>
                          {pwdVisible ? acc.password : "•".repeat(Math.min(acc.password.length, 10))}
                        </div>
                        <button
                          onClick={() => setShowPwd(p => ({ ...p, [idx]: !p[idx] }))}
                          style={{ background: "none", border: "none", cursor: "pointer",
                            fontSize: "14px", color: "#94a3b8", padding: 0 }}
                        >
                          {pwdVisible ? "🙈" : "👁"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Warning notice ── */}
      <div style={{
        marginTop: "28px", background: "#fef2f2", border: "1px solid #fca5a5",
        borderRadius: "12px", padding: "14px 18px",
        fontSize: "12px", color: "#dc2626", display: "flex", gap: "8px",
        maxWidth: "1100px", boxSizing: "border-box"
      }}>
        <span>⚠️</span>
        <span>Keep credentials secure. Changes are stored persistently in the MongoDB database. Access is shared among all instances.</span>
      </div>
    </div>
  );
};

export default CredentialsTab;
