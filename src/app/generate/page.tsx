"use client";

import Layout from "@/components/Layout";
import { Check } from "lucide-react";
import { useState } from "react";

export default function Generate() {
  const [allowSplit, setAllowSplit] = useState(true);
  const [allowSharing, setAllowSharing] = useState(true);

  return (
    <Layout>
      <h1 style={{fontSize: '24px', fontWeight: 700, marginBottom: '8px'}}>Generate Timetable</h1>
      <p style={{color: 'var(--muted)', marginBottom: '20px'}}>Set the parameters and generate the exam timetable.</p>
      <div className="card">
        <div className="row"><div><label className="label">Academic Year</label><select className="select"><option>2024/2025</option></select></div><div><label className="label">Semester</label><select className="select"><option>Second Semester</option></select></div></div>
        <div className="row"><div><label className="label">Departments</label><select className="select"><option>All Departments</option></select></div><div><label className="label">Levels</label><select className="select"><option>All Levels</option></select></div></div>
        
        <div style={{marginBottom: '16px'}}>
          <h3 style={{fontWeight: 600, marginBottom: '8px'}}>Exam Rules</h3>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
            <input type="checkbox" checked={allowSplit} onChange={e => setAllowSplit(e.target.checked)} />
            Allow one course to use multiple venues at the same time
          </label>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <input type="checkbox" checked={allowSharing} onChange={e => setAllowSharing(e.target.checked)} />
            Allow max 2 courses from different departments to share one venue at the same time
          </label>
        </div>

        <div style={{background: '#f0fdf4', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #bbf7d0'}}>
          <div style={{fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}><Check size={16} color="var(--primary)" /> Before you generate</div>
          <div style={{fontSize: '14px', color: 'var(--muted)'}}>
            <div>✓ Ensure all courses, lecturers and rooms are entered.</div>
            <div>✓ The system will enforce venue sharing and split-venue rules.</div>
          </div>
        </div>
        <button className="btn">Generate Timetable</button>
      </div>
    </Layout>
  )
}