import Layout from "@/components/Layout";
import { BookOpen, Building2, Users, GraduationCap, Plus } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {label: "Courses", value: 124, icon: BookOpen, bg: "#d1fae5"},
    {label: "Departments", value: 8, icon: Building2, bg: "#ffedd5"},
    {label: "Lecturers", value: 56, icon: Users, bg: "#dbeafe"},
    {label: "Students", value: "1,842", icon: GraduationCap, bg: "#f3e8ff"},
  ]
  return (
    <Layout>
      <h1 style={{fontSize: '24px', fontWeight: 700, marginBottom: '20px'}}>Dashboard</h1>
      <div className="grid-4" style={{marginBottom: '20px'}}>
        {stats.map(s => (<div key={s.label} className="card stat"><div className="stat-icon" style={{background: s.bg}}><s.icon color="var(--primary)" size={20} /></div><div><div style={{color: 'var(--muted)', fontSize: '14px'}}>{s.label}</div><div style={{fontSize: '24px', fontWeight: 700}}>{s.value}</div></div></div>))}
      </div>
      <div className="card" style={{marginBottom: '20px'}}>
        <h2 style={{fontWeight: 700, marginBottom: '16px'}}>Quick Actions</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px'}}>{["Add Course", "Add Lecturer", "Add Room", "Generate Timetable"].map(a => <button key={a} className="btn-outline"><Plus size={16} />{a}</button>)}</div>
      </div>
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}><h2 style={{fontWeight: 700}}>Recent Timetables</h2><a style={{color: 'var(--primary)', cursor: 'pointer'}}>View All</a></div>
        <table><thead><tr><th>#</th><th>Academic Year</th><th>Semester</th><th>Generated On</th><th>Status</th><th>Action</th></tr></thead><tbody>
          <tr><td>1</td><td>2024/2025</td><td>Second Semester</td><td>15 May 2025, 10:30 AM</td><td><span className="badge badge-green">Completed</span></td><td><a style={{color: 'var(--primary)', cursor: 'pointer'}}>View</a></td></tr>
          <tr><td>2</td><td>2024/2025</td><td>First Semester</td><td>10 Feb 2025, 09:15 AM</td><td><span className="badge badge-green">Completed</span></td><td><a style={{color: 'var(--primary)', cursor: 'pointer'}}>View</a></td></tr>
        </tbody></table>
      </div>
    </Layout>
  )
}