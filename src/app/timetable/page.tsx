"use client";
import Layout from "@/components/Layout";
import { Printer, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import { getDepartments, getTimetable } from "@/lib/api";

type Department = { id: number; name: string };

type ExamSlot = {
  id: number;
  course: { courseCode: string; courseName: string };
  room?: { roomName: string };
  examDateTime?: string;
  status: string;
  conflictReason?: string;
};

export default function Timetable() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [level, setLevel] = useState(100);
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load departments"));
  }, []);

  async function loadTimetable() {
    if (!departmentId) {
      setError("Please select a department.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await getTimetable(Number(departmentId), Number(level));
      setSlots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }

  function formatDateTime(dt?: string) {
    if (!dt) return "—";
    const d = new Date(dt);
    return d.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <Layout>
     <h1 className="page-title" style={{ marginBottom: "20px" }}>Timetable</h1>
      <div className="card no-print" style={{ marginBottom: "16px" }}>
  <div className="row">
          <div>
            <label className="label">Department</label>
            <select className="select" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)}>
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Level</label>
            <select className="select" value={level} onChange={(e) => setLevel(Number(e.target.value))}>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={300}>300</option>
              <option value={400}>400</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <button className="btn" onClick={loadTimetable}>
            View Timetable
          </button>
          <button className="btn-outline" onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: "16px", color: "#dc2626", background: "#fef2f2" }}>
          {error}
        </div>
      )}

      <div className="card">
  <div className="print-header">
    <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Exam Timetable</h2>
    <p style={{ color: "var(--muted)", fontSize: "13px" }}>
      Generated on {new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
    </p>
  </div>
  {loading ? (
  <div>
    <div className="skeleton skeleton-row" style={{ width: "100%" }} />
    <div className="skeleton skeleton-row" style={{ width: "92%" }} />
    <div className="skeleton skeleton-row" style={{ width: "96%" }} />
  </div>
) : slots.length === 0 ? (
  <div className="empty-state">
    <CalendarDays className="empty-state-icon" size={40} />
    <div className="empty-state-title">No timetable to show</div>
    <div>Select a department and level above, then click &quot;View Timetable&quot;.</div>
  </div>
) : (
  <table id="timetable-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Date & Time</th>
                <th>Venue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr key={s.id}>
                  <td>{s.course.courseCode}</td>
                  <td>{s.course.courseName}</td>
                  <td>{formatDateTime(s.examDateTime)}</td>
                  <td>{s.room?.roomName ?? "—"}</td>
                  <td>
                    {s.status === "SCHEDULED" ? (
                      <span className="badge badge-green">Scheduled</span>
                    ) : (
                      <span className="badge badge-orange" title={s.conflictReason}>
                        Conflict
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
          Showing {slots.length} entr{slots.length !== 1 ? "ies" : "y"}
        </p>
      </div>
    </Layout>
  );
}