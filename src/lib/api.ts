const API_URL = "http://localhost:8080/api";

export async function getDepartments() {
  const res = await fetch(`${API_URL}/departments`, { cache: "no-store" });
  return res.json();
}

export async function getCourses() {
  const res = await fetch(`${API_URL}/courses`, { cache: "no-store" });
  return res.json();
}

export async function getLecturers() {
  const res = await fetch(`${API_URL}/lecturers`, { cache: "no-store" });
  return res.json();
}

export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`, { cache: "no-store" });
  return res.json();
}

export async function generateTimetable(deptId: number, level: number) {
  const res = await fetch(`${API_URL}/timetable/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deptId, level }),
  });
  return res.text();
}

export async function getTimetable(deptId: number, level: number) {
  const res = await fetch(`${API_URL}/timetable/${deptId}/${level}`, { cache: "no-store" });
  return res.json();
}