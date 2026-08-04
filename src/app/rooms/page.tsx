import Layout from "@/components/Layout";
import { Plus, Pencil, Trash } from "lucide-react";

export default function Rooms() {
  const data = [
    {name: "LT1", building: "Block A", capacity: 200, type: "Lecture Theatre", canShare: true}, 
    {name: "LAB1", building: "Block B", capacity: 60, type: "Computer Lab", canShare: false}
  ]
  return (
    <Layout>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}><h1 style={{fontSize: '24px', fontWeight: 700}}>Rooms</h1><button className="btn"><Plus size={16} /> Add Room</button></div>
      <div className="card">
        <input className="input" placeholder="Search rooms..." style={{marginBottom: '16px'}} />
        <table><thead><tr><th>Room Name</th><th>Building</th><th>Capacity</th><th>Type</th><th>Allow Sharing</th><th>Actions</th></tr></thead><tbody>
          {data.map(d => <tr key={d.name}>
            <td>{d.name}</td><td>{d.building}</td><td>{d.capacity}</td><td>{d.type}</td>
            <td>{d.canShare ? <span className="badge badge-green">Yes</span> : <span className="badge badge-yellow">No</span>}</td>
            <td><button className="icon-btn"><Pencil size={16} /></button> <button className="icon-btn"><Trash size={16} /></button></td>
          </tr>)}
        </tbody></table>
      </div>
    </Layout>
  )
}