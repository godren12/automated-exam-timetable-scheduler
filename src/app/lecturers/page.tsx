"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";
import { getLecturers, createLecturer, updateLecturer, deleteLecturer } from "@/lib/api";

type Lecturer = {
  id: number;
  name: string;
  email: string;
};

export default function Lecturers() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "" });

  async function loadData() {
    setLoading(true);
    try {
      const data = await getLecturers();
      setLecturers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lecturers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm({ name: "", email: "" });
    setShowForm(true);
  }

  function openEditForm(lecturer: Lecturer) {
    setEditingId(lecturer.id);
    setForm({ name: lecturer.name, email: lecturer.email });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      if (editingId !== null) {
        await updateLecturer(editingId, form);
      } else {
        await createLecturer(form);
      }
      setForm({ name: "", email: "" });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save lecturer");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this lecturer? This cannot be undone.")) return;
    setError("");
    try {
      await deleteLecturer(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete lecturer");
    }
  }

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Lecturers</h1>
        <button className="btn" onClick={openAddForm}>
          <Plus size={16} /> Add Lecturer
        </button>
      </div>

      {error && (
        <div className="card" style={{ marginBottom: "16px", color: "#dc2626", background: "#fef2f2" }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: "16px" }}>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Dr. Kwame Mensah"
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. kwame@uni.edu"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn" type="submit">
                {editingId !== null ? "Update Lecturer" : "Save Lecturer"}
              </button>
              <button
                className="btn-outline"
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lecturers.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.email}</td>
                  <td>
                    <button className="icon-btn" onClick={() => openEditForm(l)}>
                      <Pencil size={16} />
                    </button>{" "}
                    <button className="icon-btn" onClick={() => handleDelete(l.id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
          Showing {lecturers.length} lecturer{lecturers.length !== 1 ? "s" : ""}
        </p>
      </div>
    </Layout>
  );
}