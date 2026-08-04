import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";

export default function Courses() {
  const data = [{code: "CS301", name: "Data Structures", dept: "Computer Science", credits: 3}, {code: "CS302", name: "Discrete Mathematics", dept: "Computer Science", credits: 3}]
  return (
    <Layout>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}><h1 style={{fontSize: '24px', fontWeight: 700}}>Courses</h1><button className="btn"><Plus size={16} /> Add Course</button></div>
      <div className="card">
        <input className="input" placeholder="Search courses..." style={{marginBottom: '16px'}} />
        <table><thead><tr><th>Course Code</th><th>Course Name</th><th>Department</th><th>Credit Hours</th><th>Actions</th></tr></thead><tbody>
          {data.map(d => <tr key={d.code}><td>{d.code}</td><td>{d.name}</td><td>{d.dept}</td><td>{d.credits}</td><td><button className="icon-btn"><Pencil size={16} /></button> <button className="icon-btn"><Trash size={16} /></button></td></tr>)}
        </tbody></table>
        <p style={{color: 'var(--muted)', fontSize: '12px', marginTop: '12px'}}>Showing 1 to 7 of 7 entries</p>
      </div>
    </Layout>
  )
}