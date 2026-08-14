"use client";

import Layout from "@/components/Layout";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { getDepartments, getExamPeriods, generateTimetable } from "@/lib/api";

type Department = { id: number; name: string };
type ExamPeriod = { id: number; name: string; startDate: string; endDate: string };

export default function Generate() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [examPeriods, setExamPeriods] = useState<ExamPeriod[]>([]);
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

  async function handleGenerate() {
    setError("");
    setResult("");

    if (!departmentId || !examPeriodId) {
      setError("Please select a department and an exam period.");
      return;
    }

    setGenerating(true);
    try {
      const levelValue = level === "" ? null : Number(level);
      const message = await generateTimetable(Number(departmentId), levelValue, Number(examPeriodId));
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
  Select a department, level (optional), and exam period to generate the exam timetable.
</p>
      <div className="card">
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
            <div>✓ Make sure the exam period has time slots defined.</div>
            <div>✓ Leave level as &quot;All Levels&quot; to generate the whole department at once.</div>
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