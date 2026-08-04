import Sidebar from "./Sidebar";
import { User } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">
        <div className="topbar">
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}><User size={20} /> Admin</div>
        </div>
        {children}
      </main>
    </div>
  )
}