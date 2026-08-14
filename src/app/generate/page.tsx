"use client";

import Layout from "@/components/Layout";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getDepartments, getExamPeriods, generateTimetable } from "@/lib/api";

type Department = { id: number; name: string };

type ExamTypeValue = "FIRST_SEM_MID" | "FIRST_SEM_END" | "SECOND_SEM_MID" | "SECOND_SEM_END";

const EXAM_TYPE_LABELS: Record<ExamTypeValue, string> = {
  FIRST_SEM_MID: "First Semester — Mid-Semester Exams",
  FIRST_SEM_END: "First Semester — End of Semester Exams",
  SECOND_SEM_MID: "Second Semester — Mid-Semester Exams",
  SECOND_SEM_END: "Second Semester — End of Semester Exams",
};

type ExamPeriod = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  examType?: ExamTypeValue | null;
};

type Scope = "DEPARTMENT" | "COLLEGE";

export default function Generate() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [examPeriods, setExamPeriods] = useState<ExamPeriod[]>([]);
  const [scope, setScope] = useState<Scope>("DEPARTMENT");
  const [departmentId, setDepartmentId] = useState("");
  const [level, setLevel] = useState("");
  const [examPeriodId, setExamPeriodId] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Promise.all([getDepartments(), getExamPeriods()])
      .then(([depts, periods]) => {
        setDepartments(depts);
        setExamPeriods(periods);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load data"));
  }, []);

  const selectedPeriod = examPeriods.find((p) => String(p.id) === examPeriodId);

  async function handleGenerate() {
    setError("");
    setResult("");

    if (!examPeriodId) {
      setError("Please select an exam period.");
      return;
    }
    if (scope === "DEPARTMENT" && !departmentId) {
      setError("Please select a department, or switch to College-wide.");
      return;
    }
    if (selectedPeriod && !selectedPeriod.examType) {
      setError("This exam period has no exam type set. Go to Settings and set one before generating.");
      return;
    }

    setGenerating(true);
    try {
      const levelValue = level === "" ? null : Number(level);
      const message = await generateTimetable({
        scope,
        deptId: scope === "DEPARTMENT" ? Number(departmentId) : null,
        level: levelValue,
        examPeriodId: Number(examPeriodId),
      });
      setResult(message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate timetable");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Layout>
      <h1 className="page-title" style={{ marginBottom: "8px" }}>Generate Timetable</h1>
      <p className="page-subtitle" style={{ marginBottom: "20px" }}>
  Select a scope, department, level (optional), and exam period to generate the exam timetable.
</p>
      <div className="card">
        <div className="form-group">
          <label className="label">Scope</label>
          <select
            className="select"
            value={scope}
            onChange={(e) => setScope(e.target.value as Scope)}
          >
            <option value="DEPARTMENT">Single Department</option>
            <option value="COLLEGE">Whole College</option>
          </select>
        </div>

        <div className="row">
          {scope === "DEPARTMENT" && (
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
          )}
          <div>
            <label className="label">Level (optional)</label>
            <select className="select" value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={300}>300</option>
              <option value={400}>400</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label className="label">Exam Period</label>
          <select className="select" value={examPeriodId} onChange={(e) => setExamPeriodId(e.target.value)}>
            <option value="">Select exam period</option>
            {examPeriods.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.startDate} to {p.endDate})
              </option>
            ))}
          </select>
          {selectedPeriod && (
            <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "6px" }}>
              {selectedPeriod.examType ? (
                <>Exam type: <strong>{EXAM_TYPE_LABELS[selectedPeriod.examType]}</strong></>
              ) : (
                <span style={{ color: "#dc2626" }}>
                  No exam type set for this period — set one in Settings before generating.
                </span>
              )}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#f0fdf4",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "16px",
            border: "1px solid #bbf7d0",
          }}
        >
          <div style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <Check size={16} color="var(--primary)" /> Before you generate
          </div>
          <div style={{ fontSize: "14px", color: "var(--muted)" }}>
            <div>✓ Ensure courses and rooms are entered for this department/level.</div>
            <div>✓ Make sure the exam period has time slots defined and an exam type set.</div>
            <div>✓ Leave level as &quot;All Levels&quot; to generate every level at once.</div>
            <div>✓ Choose &quot;Whole College&quot; scope to generate for every department in one go.</div>
            <div>✓ Courses that don&apos;t fit any available room/time slot will be logged as conflicts.</div>
          </div>
        </div>

        {error && (
          <div style={{ color: "#dc2626", background: "#fef2f2", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ color: "#065f46", background: "#d1fae5", padding: "12px", borderRadius: "8px", marginBottom: "16px" }}>
            {result}
          </div>
        )}

        <button className="btn" onClick={handleGenerate} disabled={generating}>
          {generating ? "Generating..." : "Generate Timetable"}
        </button>
      </div>
    </Layout>
  );
}
