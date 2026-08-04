import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";

export default function Settings() {
  const data = [{year: "2024/2025", sem: "Second Semester", start: "01 Mar 2025", end: "31 Aug 2025", status: "Active"}]
  return (
    <Layout>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}><h1 style={{fontSize: '24px', fontWeight: 700}}>Settings</h1><button className="btn"><Plus size={16} /> Add Period</button></div>
      <div className="card">
        <h2 style={{fontWeight: 700, marginBottom: '16px'}}>Academic Periods</h2>
        <table><thead><tr><th>Academic Year</th><th>Semester</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {data.map(d => <tr key={d.year}><td>{d.year}</td><td>{d.sem}</td><td>{d.start}</td><td>{d.end}</td><td><span className="badge badge-green">{d.status}</span></td><td><button className="icon-btn"><Pencil size={16} /></button> <button className="icon-btn"><Trash size={16} /></button></td></tr>)}
        </tbody></table>
      </div>
    </Layout>
  )
}