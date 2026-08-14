"use client";
import Layout from "@/components/Layout";
import { Printer, CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getDepartments, getTimetable, getTimetableAllLevels } from "@/lib/api";

type Department = { id: number; name: string };

type ExamTypeValue = "FIRST_SEM_MID" | "FIRST_SEM_END" | "SECOND_SEM_MID" | "SECOND_SEM_END";
const EXAM_TYPE_LABELS: Record<ExamTypeValue, string> = {
  FIRST_SEM_MID: "First Semester, Mid-Semester Exams",
  FIRST_SEM_END: "First Semester, End of Semester Exams",
  SECOND_SEM_MID: "Second Semester, Mid-Semester Exams",
  SECOND_SEM_END: "Second Semester, End of Semester Exams",
};

type ExamPeriodInfo = {
  id: number;
  examType: ExamTypeValue;
  startDate: string | [number, number, number];
  endDate: string | [number, number, number];
};

function formatPeriodDate(d?: string | [number, number, number]): string {
  if (!d) return "—";
  if (Array.isArray(d)) {
    const [y, m, day] = d;
    return new Date(y, m - 1, day).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

type ExamSlot = {
  id: number;
  course: {
    courseCode: string;
    courseName: string;
    studentCount: number;
    lecturer?: { name: string };
  };
  room?: { roomName: string };
  seatsInRoom?: number;
  groupId?: string | number;
  examDateTime?: string;
  level: number;
  status: string;
  conflictReason?: string;
  examPeriod?: ExamPeriodInfo;
};

export default function Timetable() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [level, setLevel] = useState("");
  const [slots, setSlots] = useState<ExamSlot[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

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
      const data = level === ""
        ? await getTimetableAllLevels(Number(departmentId))
        : await getTimetable(Number(departmentId), Number(level));
      setSlots(data);
      setLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }

  function formatDay(dt?: string) {
    if (!dt) return "—";
    const d = new Date(dt);
    return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
  }

  function formatTime(dt?: string) {
    if (!dt) return "—";
    const d = new Date(dt);
    return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  }

  const departmentName = departments.find((d) => String(d.id) === departmentId)?.name ?? "";
  const levelLabel = level === "" ? "All Levels" : `Level ${level}`;

  const levels = Array.from(new Set(slots.map((s) => s.level))).sort((a, b) => a - b);
  const groupedByLevel = level === "";

  // All slots in a loaded set share the same exam period (one dept/level query = one period)
  const examPeriod = slots.find((s) => s.examPeriod)?.examPeriod;
  const conflictCount = slots.filter((s) => s.status !== "SCHEDULED").length;

  function groupRows(rows: ExamSlot[]) {
    const grouped = rows.reduce((acc, s) => {
      const key = String(s.groupId ?? s.id);
      (acc[key] ??= []).push(s);
      return acc;
    }, {} as Record<string, ExamSlot[]>);
    return Object.values(grouped);
  }

  function renderTable(rows: ExamSlot[]) {
    const groups = groupRows(rows);
    return (
      <table id="timetable-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Time</th>
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Venue</th>
            <th>Lecturer</th>
            <th>Enrolled</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const s = group[0];
            const venue = group
              .map((g) => `${g.room?.roomName ?? "—"}${g.seatsInRoom ? ` (${g.seatsInRoom})` : ""}`)
              .join(", ");
            return (
              <tr key={String(s.groupId ?? s.id)}>
                <td>{formatDay(s.examDateTime)}</td>
                <td>{formatTime(s.examDateTime)}</td>
                <td>{s.course.courseCode}</td>
                <td>{s.course.courseName}</td>
                <td>{venue}</td>
                <td>{s.course.lecturer?.name ?? "—"}</td>
                <td>{s.course.studentCount}</td>
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
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <Layout>
      <h1 className="page-title no-print" style={{ marginBottom: "20px" }}>Timetable</h1>
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
            <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All Levels</option>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>
                {loaded
                  ? `${departmentName} — ${levelLabel}${examPeriod ? ` — ${EXAM_TYPE_LABELS[examPeriod.examType]}` : ""}`
                  : "Exam Timetable"}
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "13px" }}>
                {examPeriod ? `${formatPeriodDate(examPeriod.startDate)} to ${formatPeriodDate(examPeriod.endDate)}` : ""}
              </p>
            </div>
            {loaded && conflictCount > 0 && (
              <Link
                className="no-print"
                href={`/conflicts?deptId=${departmentId}&level=${level}&examPeriodId=${examPeriod?.id ?? ""}`}
              >
                <span className="badge badge-danger">
                  {conflictCount} Conflict{conflictCount !== 1 ? "s" : ""}
                </span>
              </Link>
            )}
          </div>
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
            <div>Select a department above (level is optional), then click &quot;View Timetable&quot;.</div>
          </div>
        ) : groupedByLevel ? (
          levels.map((lvl) => (
            <div key={lvl} style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "16px 0 8px" }}>
                {departmentName} — Level {lvl}
              </h3>
              {renderTable(slots.filter((s) => s.level === lvl))}
            </div>
          ))
        ) : (
          renderTable(slots)
        )}
        <p className="no-print" style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
          Showing {slots.length} entr{slots.length !== 1 ? "ies" : "y"}
        </p>
      </div>
    </Layout>
  );
}
