const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with status ${res.status}`);
  }
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }
  return res.text();
}

// Departments
export async function getDepartments() {
  const res = await fetch(`${API_URL}/departments`, { cache: "no-store" });
  return handleResponse(res);
}

export async function createDepartment(data: { name: string; code: string }) {
  const res = await fetch(`${API_URL}/departments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Courses
export async function getCourses() {
  const res = await fetch(`${API_URL}/courses`, { cache: "no-store" });
  return handleResponse(res);
}

export async function createCourse(data: {
  courseCode: string;
  courseName: string;
  level: number;
  studentCount: number;
  department: { id: number };
  lecturer?: { id: number };
}) {
  const res = await fetch(`${API_URL}/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Rooms
export async function getRooms() {
  const res = await fetch(`${API_URL}/rooms`, { cache: "no-store" });
  return handleResponse(res);
}

export async function createRoom(data: { roomName: string; capacity: number }) {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Lecturers
export async function getLecturers() {
  const res = await fetch(`${API_URL}/lecturers`, { cache: "no-store" });
  return handleResponse(res);
}

export async function createLecturer(data: { name: string; email: string }) {
  const res = await fetch(`${API_URL}/lecturers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Exam Periods
export async function getExamPeriods() {
  const res = await fetch(`${API_URL}/exam-periods`, { cache: "no-store" });
  return handleResponse(res);
}

export async function createExamPeriod(data: {
  name: string;
  startDate: string;
  endDate: string;
  examType: string;
}) {
  const res = await fetch(`${API_URL}/exam-periods`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Time Slots
export async function getTimeSlotsByPeriod(examPeriodId: number) {
  const res = await fetch(`${API_URL}/time-slots/period/${examPeriodId}`, { cache: "no-store" });
  return handleResponse(res);
}

export async function createTimeSlot(data: {
  label: string;
  startTime: string;
  endTime: string;
  examPeriod: { id: number };
}) {
  const res = await fetch(`${API_URL}/time-slots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// Timetable
export async function generateTimetable(data: {
  scope: "DEPARTMENT" | "COLLEGE";
  deptId: number | null;
  level: number | null;
  examPeriodId: number;
}) {
  const res = await fetch(`${API_URL}/timetable/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function getTimetable(deptId: number, level: number) {
  const res = await fetch(`${API_URL}/timetable/${deptId}/${level}`, { cache: "no-store" });
  return handleResponse(res);
}

export async function getTimetableAllLevels(deptId: number) {
  const res = await fetch(`${API_URL}/timetable/department/${deptId}`, { cache: "no-store" });
  return handleResponse(res);
}

export async function getAllTimetables() {
  const res = await fetch(`${API_URL}/timetable/all`, { cache: "no-store" });
  return handleResponse(res);
}

// Update/Delete — Courses
export async function updateCourse(id: number, data: object) {
  const res = await fetch(`${API_URL}/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteCourse(id: number) {
  const res = await fetch(`${API_URL}/courses/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// Update/Delete — Rooms
export async function updateRoom(id: number, data: object) {
  const res = await fetch(`${API_URL}/rooms/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteRoom(id: number) {
  const res = await fetch(`${API_URL}/rooms/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// Update/Delete — Departments
export async function updateDepartment(id: number, data: object) {
  const res = await fetch(`${API_URL}/departments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteDepartment(id: number) {
  const res = await fetch(`${API_URL}/departments/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// Update/Delete — Lecturers
export async function updateLecturer(id: number, data: object) {
  const res = await fetch(`${API_URL}/lecturers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteLecturer(id: number) {
  const res = await fetch(`${API_URL}/lecturers/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function signup(email: string, password: string) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

// Auth
export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

export async function verifyLoginCode(email: string, code: string) {
  const res = await fetch(`${API_URL}/users/verify-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  return handleResponse(res);
}

export async function toggle2FA(id: number, enabled: boolean) {
  const res = await fetch(`${API_URL}/users/${id}/2fa`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  return handleResponse(res);
}

export async function getUser(id: number) {
  const res = await fetch(`${API_URL}/users/${id}`, { cache: "no-store" });
  return handleResponse(res);
}
export async function changePassword(id: number, currentPassword: string, newPassword: string) {
  const res = await fetch(`${API_URL}/users/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
}
export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/users/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const res = await fetch(`${API_URL}/users/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  return handleResponse(res);
}
export async function googleLogin(idToken: string) {
  const res = await fetch(`${API_URL}/users/google-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  return handleResponse(res);
}