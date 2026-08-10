"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api";

type Room = {
  id: number;
  roomName: string;
  capacity: number;
};

export default function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ roomName: "", capacity: 0 });

  async function loadData() {
    setLoading(true);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm({ roomName: "", capacity: 0 });
    setShowForm(true);
  }

  function openEditForm(room: Room) {
    setEditingId(room.id);
    setForm({ roomName: room.roomName, capacity: room.capacity });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.roomName || form.capacity <= 0) {
      setError("Please enter a room name and a capacity greater than 0.");
      return;
    }

    try {
      if (editingId !== null) {
        await updateRoom(editingId, { roomName: form.roomName, capacity: Number(form.capacity) });
      } else {
        await createRoom({ roomName: form.roomName, capacity: Number(form.capacity) });
      }
      setForm({ roomName: "", capacity: 0 });
      setEditingId(null);
      setShowForm(false);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save room");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    setError("");
    try {
      await deleteRoom(id);
      loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete room");
    }
  }

  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700 }}>Rooms</h1>
        <button className="btn" onClick={openAddForm}>
          <Plus size={16} /> Add Room
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
                <label className="label">Room Name</label>
                <input
                  className="input"
                  value={form.roomName}
                  onChange={(e) => setForm({ ...form, roomName: e.target.value })}
                  placeholder="e.g. Hall A"
                />
              </div>
              <div>
                <label className="label">Capacity</label>
                <input
                  className="input"
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn" type="submit">
                {editingId !== null ? "Update Room" : "Save Room"}
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
                <th>Room Name</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id}>
                  <td>{r.roomName}</td>
                  <td>{r.capacity}</td>
                  <td>
                    <button className="icon-btn" onClick={() => openEditForm(r)}>
                      <Pencil size={16} />
                    </button>{" "}
                    <button className="icon-btn" onClick={() => handleDelete(r.id)}>
                      <Trash size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "12px" }}>
          Showing {rooms.length} room{rooms.length !== 1 ? "s" : ""}
        </p>
      </div>
    </Layout>
  );
}