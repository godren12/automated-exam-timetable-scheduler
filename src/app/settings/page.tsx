"use client";

import Layout from "@/components/Layout";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getExamPeriods, createExamPeriod, getTimeSlotsByPeriod, createTimeSlot } from "@/lib/api";

type ExamPeriod = { id: number; name: string; startDate: string; endDate: string };
type TimeSlot = { id: number; label: string; startTime: string; endTime: string };

export default function Settings() {
  const [periods, setPeriods] = useState<ExamPeriod[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", startDate: "", endDate: "" });

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [slotsByPeriod, setSlotsByPeriod] = useState<Record<number, TimeSlot[]>>({});
  const [slotForm, setSlotForm] = useState({ label: "", startTime: "", endTime: "" });

  async function loadPeriods() {
    setLoading(true);
    try {
      const data = await getExamPeriods();
      setPeriods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exam periods");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPeriods();
  }, []);

  async function handleCreatePeriod(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.startDate || !form.endDate) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await createExamPeriod(form);
      setForm({ name: "", startDate: "", endDate: "" });
      setShowForm(false);
      loadPeriods();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create exam period");
    }
  }

  async function toggleExpand(periodId: number) {
    if (expandedId === periodId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(periodId);
    if (!slotsByPeriod[periodId]) {
      try {
        const slots = await getTimeSlotsByPeriod(periodId);
        setSlotsByPeriod((prev) => ({ ...prev, [periodId]: slots }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load time slots");
      }
    }
  }

  async function handleAddSlot(periodId: number, e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!slotForm.label || !slotForm.startTime || !slotForm.endTime) {
      setError("Please fill in all time slot fields.");
      return;
    }

    try {
      await createTimeSlot({
        label: slotForm.label,
        startTime: slotForm.startTime + ":00",
        endTime: slotForm.endTime + ":00",
        examPeriod: { id: periodId },
      });
      setSlotForm({ label: "", startTime: "", endTime: "" });
      const slots = await getTimeSlotsByPeriod(periodId);
      setSlotsByPeriod((prev) => ({ ...prev, [periodId]: slots }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add time slot");
    }
  }

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Settings</h1>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Exam Period
        </button>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: "16px", color: "#dc2626", background: "#fef2f2" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: "16px" }}>
          <form onSubmit={handleCreatePeriod}>
            <div className="form-group">
              <label className="label">Period Name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Second Semester Finals, Aug 2026"
              />
            </div>
            <div className="row">
              <div>
                <label className="label">Start Date</label>
                <input
                  className="input"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="label">End Date</label>
                <input
                  className="input"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>
            <button className="btn" type="submit">
              Save Exam Period
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h2 style={{ fontWeight: 700, marginBottom: "16px" }}>Exam Periods</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Time Slots</th>
              </tr>
            </thead>
            <tbody>
              {periods.map((p) => (
                <>
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.startDate}</td>
                    <td>{p.endDate}</td>
                    <td>
                      <button className="btn-outline" onClick={() => toggleExpand(p.id)}>
                        {expandedId === p.id ? "Hide" : "Manage"} Time Slots
                      </button>
                    </td>
                  </tr>
                  {expandedId === p.id && (
                    <tr>
                      <td colSpan={4} style={{ background: "var(--bg)" }}>
                        <div style={{ padding: "16px" }}>
                          <h3 style={{ fontWeight: 600, marginBottom: "12px" }}>Time Slots</h3>
                          {(slotsByPeriod[p.id] ?? []).length === 0 ? (
                            <p style={{ color: "var(--muted)", marginBottom: "12px" }}>
                              No time slots yet. Add at least one before generating a timetable for this period.
                            </p>
                          ) : (
                            <table style={{ marginBottom: "16px" }}>
                              <thead>
                                <tr>
                                  <th>Label</th>
                                  <th>Start Time</th>
                                  <th>End Time</th>
                                </tr>
                              </thead>
                              <tbody>
                                {slotsByPeriod[p.id].map((s) => (
                                  <tr key={s.id}>
                                    <td>{s.label}</td>
                                    <td>{s.startTime}</td>
                                    <td>{s.endTime}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                          <form onSubmit={(e) => handleAddSlot(p.id, e)}>
                            <div className="row">
                              <div>
                                <label className="label">Label</label>
                                <input
                                  className="input"
                                  value={slotForm.label}
                                  onChange={(e) => setSlotForm({ ...slotForm, label: e.target.value })}
                                  placeholder="e.g. Morning"
                                />
                              </div>
                              <div>
                                <label className="label">Start Time</label>
                                <input
                                  className="input"
                                  type="time"
                                  value={slotForm.startTime}
                                  onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="label">End Time</label>
                                <input
                                  className="input"
                                  type="time"
                                  value={slotForm.endTime}
                                  onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                                />
                              </div>
                            </div>
                            <button className="btn" type="submit">
                              Add Time Slot
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}