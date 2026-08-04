"use client"
import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { getDepartments } from "@/lib/api";

export default function Departments() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    getDepartments().then(setData)
  }, [])

  return (
    <Layout>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
        <h1 style={{fontSize: '24px', fontWeight: 700}}>Departments</h1>
        <button className="btn"><Plus size={16} /> Add Department</button>
      </div>
      <div className="card">
        <input className="input" placeholder="Search departments..." style={{marginBottom: '16px'}} />
        <table><thead><tr><th>Department Name</th><th>Description</th><th>Actions</th></tr></thead><tbody>
          {data.map(d =>
            <tr key={d.id}>
              <td>{d.name}</td>
              <td>{d.code}</td>
              <td>
                <button className="icon-btn"><Pencil size={16} /></button>
                <button className="icon-btn"><Trash size={16} /></button>
              </td>
            </tr>
          )}
        </tbody></table>
      </div>
    </Layout>
  )
}