"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { User, ChevronDown, LogOut } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [displayName, setDisplayName] = useState("Admin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const user = JSON.parse(stored);
        if (user.email) {
          const namePart = user.email.split("@")[0];
          const formatted = namePart.charAt(0).toUpperCase() + namePart.slice(1);
          setDisplayName(formatted);
        }
      } catch {
        // keep default "Admin"
      }
    }
  }, []);

  function confirmLogout() {
    localStorage.removeItem("user");
    router.push("/");
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
    </div>
  );
}