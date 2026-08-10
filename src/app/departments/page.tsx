"use client";
import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "@/lib/api";

type Department = {
  id: number;
  name: string;
  code: string;
};

export default function Departments() {
  const [data, setData] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", code: "" });

  async function loadData() {
    setLoading(true);
    try {
      const depts = await getDepartments();
      setData(depts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load departments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm({ name: "", code: "" });
    setShowForm(true);
  }

  function openEditForm(dept: Department) {
    setEditingId(dept.id);
    setForm({ name: dept.name, code: dept.code });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.code) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      if (editingId !== null) {
        await updateDepartment(editingId, form);
      } else {
        await createDepartment(form);
      }
      setForm({ name: "", code: "" });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save department");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this department? This cannot be undone.")) return;
    setError("");
    try {
      await deleteDepartment(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete department");
    }
  }

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Departments</h1>
        <button className="btn" onClick={openAddForm}>
          <Plus size={16} /> Add Department
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
                <label className="label">Department Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="label">Code</label>
                <input
                  className="input"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. CS"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn" type="submit">
                {editingId !== null ? "Update Department" : "Save Department"}
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
                <th>Department Name</th>
                <th>Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.code}</td>
                  <td>
                    <button className="icon-btn" onClick={() => openEditForm(d)}>
                      <Pencil size={16} />
                    </button>{" "}
                    <button className="icon-btn" onClick={() => handleDelete(d.id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
          Showing {data.length} department{data.length !== 1 ? "s" : ""}
        </p>
      </div>
    </Layout>
  );
}