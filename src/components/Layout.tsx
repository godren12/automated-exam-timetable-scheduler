"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { User, ChevronDown, LogOut, Settings } from "lucide-react";
import { changePassword } from "@/lib/api";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.email) {
          setEmail(user.email);
          const namePart = user.email.split("@")[0];
          const formatted = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          setDisplayName(formatted);
        }
        if (user.id) setUserId(user.id);
      } catch {
        // keep default "Admin"
      }
    }
  }, []);

  function confirmLogout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  function openProfile() {
    setMenuOpen(false);
    setProfileError("");
    setProfileSuccess("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowProfileModal(true);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    if (!userId) {
      setProfileError("Could not identify your account. Please log in again.");
      return;
    }
    if (newPassword.length < 6) {
      setProfileError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setProfileError("New passwords do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword(userId, currentPassword, newPassword);
      setProfileSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="layout">
      <Sidebar onLogoutClick={() => setShowLogoutModal(true)} />
      <main className="main">
        <div className="topbar">
          <div className="user-menu-wrapper">
            <button className="user-menu-trigger" onClick={() => setMenuOpen(!menuOpen)}>
              <User size={20} />
              <span>{displayName}</span>
              <ChevronDown size={16} className={menuOpen ? "chevron-open" : ""} />
            </button>
            {menuOpen && (
              <>
                <div className="user-menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="user-menu-dropdown">
                  <button className="user-menu-item" style={{ color: "var(--text)" }} onClick={openProfile}>
                    <User size={16} /> Profile
                  </button>
                  <button
                    className="user-menu-item"
                    style={{ color: "var(--text)" }}
                    onClick={() => {
                      setMenuOpen(false);
                      router.push("/settings");
                    }}
                  >
                    <Settings size={16} /> Settings
                  </button>
                  <button
                    className="user-menu-item"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {children}
      </main>

      {showLogoutModal && (
        <div className="modal-backdrop" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Log out?</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "420px" }}>
            <h3 style={{ marginBottom: "4px" }}>Profile</h3>
            <p style={{ marginBottom: "20px" }}>{email || "—"}</p>

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="label">Current Password</label>
                <input
                  type="password"
                  className="input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">New Password</label>
                <input
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Confirm New Password</label>
                <input
                  type="password"
                  className="input"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>

              {profileError && <div className="form-error">{profileError}</div>}
              {profileSuccess && (
                <div style={{ color: "#065f46", background: "#d1fae5", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
                  {profileSuccess}
                </div>
              )}

              <div className="modal-actions">
                <button className="btn-outline" type="button" onClick={() => setShowProfileModal(false)}>
                  Close
                </button>
                <button className="btn" type="submit" disabled={savingPassword}>
                  {savingPassword ? "Saving..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}