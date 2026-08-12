"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Plus, Pencil, Trash, BookOpen } from "lucide-react";
import { getCourses, createCourse, updateCourse, deleteCourse, getDepartments } from "@/lib/api";

type Course = {
  id: number;
  courseCode: string;
  courseName: string;
  level: number;
  studentCount: number;
  department?: { id: number; name: string };
};

type Department = {
  id: number;
  name: string;
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    courseCode: "",
    courseName: "",
    level: 100,
    studentCount: 0,
    departmentId: "",
  });

  async function loadData() {
    setLoading(true);
    try {
      const [coursesData, deptsData] = await Promise.all([getCourses(), getDepartments()]);
      setCourses(coursesData);
      setDepartments(deptsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm({ courseCode: "", courseName: "", level: 100, studentCount: 0, departmentId: "" });
    setShowForm(true);
  }

  function openEditForm(course: Course) {
    setEditingId(course.id);
    setForm({
      courseCode: course.courseCode,
      courseName: course.courseName,
      level: course.level,
      studentCount: course.studentCount,
      departmentId: course.department ? String(course.department.id) : "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.courseCode || !form.courseName || !form.departmentId) {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      courseCode: form.courseCode,
      courseName: form.courseName,
      level: Number(form.level),
      studentCount: Number(form.studentCount),
      department: { id: Number(form.departmentId) },
    };

    try {
      if (editingId !== null) {
        await updateCourse(editingId, payload);
      } else {
        await createCourse(payload);
      }
      setForm({ courseCode: "", courseName: "", level: 100, studentCount: 0, departmentId: "" });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save course");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this course? This cannot be undone.")) return;
    setError("");
    try {
      await deleteCourse(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete course");
    }
  }

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 className="page-title">Courses</h1>
        <button className="btn" onClick={openAddForm}>
          <Plus size={16} /> Add Course
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
                <label className="label">Course Code</label>
                <input
                  className="input"
                  value={form.courseCode}
                  onChange={(e) => setForm({ ...form, courseCode: e.target.value })}
                  placeholder="e.g. CS101"
                />
              </div>
              <div>
                <label className="label">Course Name</label>
                <input
                  className="input"
                  value={form.courseName}
                  onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                  placeholder="e.g. Intro to Programming"
                />
              </div>
            </div>
            <div className="row">
              <div>
                <label className="label">Level</label>
                <select
                  className="select"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
                >
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                  <option value={300}>300</option>
                  <option value={400}>400</option>
                </select>
              </div>
              <div>
                <label className="label">Students Enrolled</label>
                <input
                  className="input"
                  type="number"
                  value={form.studentCount}
                  onChange={(e) => setForm({ ...form, studentCount: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="label">Department</label>
              <select
                className="select"
                value={form.departmentId}
                onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn" type="submit">
                {editingId !== null ? "Update Course" : "Save Course"}
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
  <div>
    <div className="skeleton skeleton-row" style={{ width: "100%" }} />
    <div className="skeleton skeleton-row" style={{ width: "90%" }} />
    <div className="skeleton skeleton-row" style={{ width: "95%" }} />
  </div>
) : courses.length === 0 ? (
  <div className="empty-state">
    <BookOpen className="empty-state-icon" size={40} />
    <div className="empty-state-title">No courses yet</div>
    <div>Click &quot;Add Course&quot; above to create your first one.</div>
  </div>
) : (
  <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Level</th>
                <th>Students</th>
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id}>
                  <td>{c.courseCode}</td>
                  <td>{c.courseName}</td>
                  <td>{c.level}</td>
                  <td>{c.studentCount}</td>
                  <td>{c.department?.name ?? "—"}</td>
                  <td>
                    <button className="icon-btn" onClick={() => openEditForm(c)}>
                      <Pencil size={16} />
                    </button>{" "}
                    <button className="icon-btn" onClick={() => handleDelete(c.id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
          Showing {courses.length} course{courses.length !== 1 ? "s" : ""}
        </p>
      </div>
    </Layout>
  );
}