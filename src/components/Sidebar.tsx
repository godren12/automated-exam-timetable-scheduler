"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, Zap, BookOpen, Building2, Users, DoorOpen, AlertTriangle, Settings, LogOut } from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Timetable", icon: CalendarDays, href: "/timetable" },
  { name: "Generate", icon: Zap, href: "/generate" },
  { name: "Courses", icon: BookOpen, href: "/courses" },
  { name: "Departments", icon: Building2, href: "/departments" },
  { name: "Lecturers", icon: Users, href: "/lecturers" },
  { name: "Rooms", icon: DoorOpen, href: "/rooms" },
  { name: "Conflicts", icon: AlertTriangle, href: "/conflicts" },
  { name: "Settings", icon: Settings, href: "/settings" },
]

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <CalendarDays size={28} />
        <div>
          <div>Automated</div>
          <div style={{fontSize: '12px', fontWeight: 400}}>Timetable Scheduler</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {menu.map(item => (
          <Link key={item.name} href={item.href} className={`sidebar-item ${pathname === item.href ? "active" : ""}`}>
            <item.icon size={18} /> {item.name}
          </Link>
        ))}
      </nav>
      <button className="sidebar-item logout"><LogOut size={18} /> Logout</button>
    </aside>
  )
}