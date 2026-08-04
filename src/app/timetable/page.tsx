"use client";
import Layout from "@/components/Layout";
import { Printer } from "lucide-react";

export default function Timetable() {
  // Updated: venue is now an array
  const data = [
    {code: "CS301", name: "Data Structures", date: "19 May 2025", time: "8:00 AM - 10:00 AM", venues: ["LT1", "LT2"]}, // split venue
    {code: "CS303", name: "Discrete Mathematics", date: "20 May 2025", time: "10:30 AM - 12:30 PM", venues: ["LT3"]},
    {code: "IT201", name: "Database Systems", date: "19 May 2025", time: "8:00 AM - 10:00 AM", venues: ["LT4"]}, // shares time with CS301 but different venue
  ]

  return (
    <Layout>
      <h1 style={{fontSize: '24px', fontWeight: 700, marginBottom: '20px'}}>Timetable</h1>
      <div className="card" style={{marginBottom: '16px'}}>
        <div className="row">
          <div><label className="label">Academic Year</label><select className="select"><option>2024/2025</option></select></div>
          <div><label className="label">Semester</label><select className="select"><option>Second Semester</option></select></div>
          <div><label className="label">Department</label><select className="select"><option>All Departments</option></select></div>
          <div><label className="label">Level</label><select className="select"><option>All Levels</option></select></div>
        </div>
        <div style={{display: 'flex', gap: '12px', marginBottom: '16px'}}>{["By Department", "By Lecturer", "By Room"].map(t => <button key={t} className="btn-outline">{t}</button>)}</div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
          <div style={{width: '200px'}}><label className="label">Department</label><select className="select"><option>Computer Science</option></select></div>
          <button className="btn">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>
      <div className="card">
        <table id="timetable-table">
          <thead><tr><th>Course Code</th><th>Course Name</th><th>Date</th><th>Time</th><th>Venue(s)</th></tr></thead>
          <tbody>
            {data.map(d => (
              <tr key={d.code}>
                <td>{d.code}</td>
                <td>{d.name}</td>
                <td>{d.date}</td>
                <td>{d.time}</td>
                <td><span className="badge badge-blue">{d.venues.join(' + ')}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{color: 'var(--muted)', fontSize: '12px', marginTop: '12px'}}>Showing 1 to 3 of 3 entries</p>
      </div>
    </Layout>
  )
}