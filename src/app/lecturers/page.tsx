import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";

export default function Lecturers() {
  const data = [{name: "Dr. Kwame Mensah", dept: "Computer Science"}, {name: "Dr. Sarah Addo", dept: "Information Technology"}]
  return (
    <Layout>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}><h1 style={{fontSize: '24px', fontWeight: 700}}>Lecturers</h1><button className="btn"><Plus size={16} /> Add Lecturer</button></div>
      <div className="card">
        <input className="input" placeholder="Search lecturers..." style={{marginBottom: '16px'}} />
        <table><thead><tr><th>Full Name</th><th>Department</th><th>Actions</th></tr></thead><tbody>
          {data.map(d => <tr key={d.name}><td>{d.name}</td><td>{d.dept}</td><td><button className="icon-btn"><Pencil size={16} /></button> <button className="icon-btn"><Trash size={16} /></button></td></tr>)}
        </tbody></table>
      </div>
    </Layout>
  )
}