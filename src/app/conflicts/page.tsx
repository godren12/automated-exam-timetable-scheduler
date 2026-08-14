"use client";

import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { getDepartments, getTimetable, getTimetableAllLevels, getAllTimetables } from "@/lib/api";
import { CheckCircle2, Globe2 } from "lucide-react";

type Department = { id: number; name: string };

type ExamSlot = {
  id: number;
  course: { courseCode: string; courseName: string; studentCount: number };
  department?: { name: string };
  level?: number;
  status: string;
  conflictReason?: string;
};

export default function Conflicts() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [level, setLevel] = useState("");
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [viewingAll, setViewingAll] = useState(false);

  useEffect(() => {
    getDepartments()
      .then(setDepartments)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load departments"));
  }, []);

  async function loadConflicts() {
    if (!departmentId) {
      setError("Please select a department.");
      return;
    }
    setError("");
    setLoading(true);
    setViewingAll(false);
    try {
      const data = level === ""
        ? await getTimetableAllLevels(Number(departmentId))
        : await getTimetable(Number(departmentId), Number(level));
      setSlots(data);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conflicts");
    } finally {
      setLoading(false);
    }
  }

  async function loadAllConflicts() {
    setError("");
    setLoading(true);
    setViewingAll(true);
    try {
      const data = await getAllTimetables();
      setSlots(data);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load conflicts");
    } finally {
      setLoading(false);
    }
  }

  const conflicts = slots.filter((s) => s.status === "CONFLICT");
  const scheduled = slots.filter((s) => s.status === "SCHEDULED");

  return (
    <Layout>
      <h1 className="page-title" style={{ marginBottom: "8px" }}>Conflicts</h1>
      <p className="page-subtitle" style={{ marginBottom: "20px" }}>
        Check a specific department, or view every conflict across the whole system.
      </p>

      <div className="card" style={{ marginBottom: "16px" }}>
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
            <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={300}>300</option>
              <option value={400}>400</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn" onClick={loadConflicts}>
            Check Department
          </button>
          <button className="btn-outline" onClick={loadAllConflicts}>
            <Globe2 size={16} /> View All Conflicts
          </button>
        </div>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: "16px", color: "#dc2626", background: "#fef2f2" }}>
          {error}
        </div>
      )}

      {loading ? (
        <div className="card">
          <div className="skeleton skeleton-row" style={{ width: "100%" }} />
          <div className="skeleton skeleton-row" style={{ width: "90%" }} />
        </div>
      ) : (
        searched && (
          <>
            <div className="grid-4" style={{ marginBottom: "20px" }}>
              <div className="card">
                <div style={{ color: "var(--muted)" }}>Total Exams</div>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>{slots.length}</div>
              </div>
              <div className="card">
                <div style={{ color: "var(--muted)" }}>Scheduled</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#16a34a" }}>{scheduled.length}</div>
              </div>
              <div className="card">
                <div style={{ color: "var(--muted)" }}>Conflicts</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#dc2626" }}>{conflicts.length}</div>
              </div>
              <div className="card">
                <div style={{ color: "var(--muted)" }}>Resolution Rate</div>
                <div style={{ fontSize: "24px", fontWeight: 700 }}>
                  {slots.length > 0 ? Math.round((scheduled.length / slots.length) * 100) : 0}%
                </div>
              </div>
            </div>

            <div className="card">
              <h2 style={{ fontWeight: 700, marginBottom: "16px" }}>
                {viewingAll ? "All Detected Conflicts (System-wide)" : "Detected Conflicts"}
              </h2>
              {conflicts.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle2 className="empty-state-icon" size={40} color="#16a34a" />
                  <div className="empty-state-title">No conflicts found</div>
                  <div>Every course was scheduled successfully.</div>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      {viewingAll && <th>Department</th>}
                      {viewingAll && <th>Level</th>}
                      <th>Course Code</th>
                      <th>Course Name</th>
                      <th>Students</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conflicts.map((c) => (
                      <tr key={c.id}>
                        {viewingAll && <td>{c.department?.name ?? "—"}</td>}
                        {viewingAll && <td>{c.level ?? "—"}</td>}
                        <td>{c.course.courseCode}</td>
                        <td>{c.course.courseName}</td>
                        <td>{c.course.studentCount}</td>
                        <td>
                          <span className="badge badge-orange">{c.conflictReason}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )
      )}
    </Layout>
  );
}