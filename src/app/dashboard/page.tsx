"use client";

import Layout from "@/components/Layout";
import { BookOpen, Building2, Users, DoorOpen, Plus, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getCourses, getDepartments, getLecturers, getRooms } from "@/lib/api";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type Course = {
  id: number;
  courseCode: string;
  courseName: string;
  level: number;
  studentCount: number;
  department?: { id: number; name: string };
};

export default function Dashboard() {
  const [counts, setCounts] = useState({ courses: 0, departments: 0, lecturers: 0, rooms: 0 });
  const [courses, setCourses] = useState<Course[]>([]);
  const [chartData, setChartData] = useState<{ name: string; courses: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getCourses(), getDepartments(), getLecturers(), getRooms()])
      .then(([coursesData, departments, lecturers, rooms]) => {
        setCounts({
          courses: coursesData.length,
          departments: departments.length,
          lecturers: lecturers.length,
          rooms: rooms.length,
        });
        setCourses(coursesData);

        const byDept: Record<string, number> = {};
        coursesData.forEach((c: Course) => {
          const name = c.department?.name ?? "Unassigned";
          byDept[name] = (byDept[name] ?? 0) + 1;
        });
        setChartData(Object.entries(byDept).map(([name, courses]) => ({ name, courses })));
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

  const recentCourses = [...courses].sort((a, b) => b.id - a.id).slice(0, 5);

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

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "16px" }}>Courses by Department</h2>
          {loading ? (
            <div className="skeleton" style={{ height: "220px", width: "100%" }} />
          ) : chartData.length === 0 ? (
            <div className="empty-state">
              <BookOpen className="empty-state-icon" size={32} />
              <div className="empty-state-title">No course data yet</div>
              <div>Add courses to see this chart populate.</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f4" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "13px" }}
                  cursor={{ fill: "#f0fdf4" }}
                />
                <Bar dataKey="courses" fill="#0d7a4f" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "16px" }}>Recently Added</h2>
          {loading ? (
            <div>
              <div className="skeleton skeleton-row" style={{ width: "100%" }} />
              <div className="skeleton skeleton-row" style={{ width: "90%" }} />
              <div className="skeleton skeleton-row" style={{ width: "95%" }} />
            </div>
          ) : recentCourses.length === 0 ? (
            <div className="empty-state">
              <Clock className="empty-state-icon" size={32} />
              <div className="empty-state-title">Nothing yet</div>
              <div>Recently added courses will show up here.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {recentCourses.map((c) => (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{c.courseCode}</div>
                    <div style={{ color: "var(--muted)", fontSize: "12px" }}>{c.department?.name ?? "Unassigned"}</div>
                  </div>
                  <span className="badge badge-blue">Lvl {c.level}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: "16px", fontSize: "16px" }}>Quick Actions</h2>
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