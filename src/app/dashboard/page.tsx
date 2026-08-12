"use client";

import Layout from "@/components/Layout";
import { BookOpen, Building2, Users, DoorOpen, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getCourses, getDepartments, getLecturers, getRooms } from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const [counts, setCounts] = useState({ courses: 0, departments: 0, lecturers: 0, rooms: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCourses(), getDepartments(), getLecturers(), getRooms()])
      .then(([courses, departments, lecturers, rooms]) => {
        setCounts({
          courses: courses.length,
          departments: departments.length,
          lecturers: lecturers.length,
          rooms: rooms.length,
        });
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
  { label: "Courses", value: counts.courses, icon: BookOpen, bg: "#d1fae5", href: "/courses" },
  { label: "Departments", value: counts.departments, icon: Building2, bg: "#ffedd5", href: "/departments" },
  { label: "Lecturers", value: counts.lecturers, icon: Users, bg: "#dbeafe", href: "/lecturers" },
  { label: "Rooms", value: counts.rooms, icon: DoorOpen, bg: "#f3e8ff", href: "/rooms" },
];

  const quickActions = [
    { label: "Add Course", href: "/courses" },
    { label: "Add Lecturer", href: "/lecturers" },
    { label: "Add Room", href: "/rooms" },
    { label: "Generate Timetable", href: "/generate" },
  ];

  return (
    <Layout>
      <h1 className="page-title" style={{ marginBottom: "20px" }}>Dashboard</h1>

      {error && (
        <div className="card" style={{ marginBottom: "16px", color: "#dc2626", background: "#fef2f2" }}>
          {error}
        </div>
      )}

     <div className="grid-4" style={{ marginBottom: "20px" }}>
  {stats.map((s) => (
    <Link key={s.label} href={s.href} className="card stat" style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
      <div className="stat-icon" style={{ background: s.bg }}>
        <s.icon color="var(--primary)" size={20} />
      </div>
      <div>
        <div style={{ color: "var(--muted)", fontSize: "14px" }}>{s.label}</div>
        <div style={{ fontSize: "24px", fontWeight: 700 }}>
          {loading ? <div className="skeleton" style={{ width: "40px", height: "24px" }} /> : s.value}
        </div>
      </div>
    </Link>
  ))}
</div>

      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: "16px" }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
          {quickActions.map((a) => (
            <Link key={a.label} href={a.href} className="btn-outline" style={{ textDecoration: "none" }}>
              <Plus size={16} />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}