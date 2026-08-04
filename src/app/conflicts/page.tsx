import Layout from "@/components/Layout";
import { AlertTriangle } from "lucide-react";

export default function Conflicts() {
  const conflicts = [
    {type: "Venue Overbook", desc: "3 courses scheduled in LT1 at 8:00 AM 19 May", rule: "Max 2 courses per venue"},
    {type: "Same Dept Sharing", desc: "CS301 and CS302 in LT2 at 10:30 AM 20 May", rule: "Must be different departments"},
    {type: "Split Time Mismatch", desc: "MTH101 scheduled in LT4 and LT5 at different times", rule: "Split venues must be same time"}
  ]
  return (
    <Layout>
      <h1 style={{fontSize: '24px', fontWeight: 700, marginBottom: '20px'}}>Conflicts</h1>
      <div className="grid-4" style={{marginBottom: '20px'}}>
        <div className="card"><div style={{color: 'var(--muted)'}}>Total Conflicts</div><div style={{fontSize: '24px', fontWeight: 700}}>{conflicts.length}</div></div>
        <div className="card"><div style={{color: 'var(--muted)'}}>Venue Overbook</div><div style={{fontSize: '24px', fontWeight: 700}}>1</div></div>
        <div className="card"><div style={{color: 'var(--muted)'}}>Dept Sharing Violation</div><div style={{fontSize: '24px', fontWeight: 700}}>1</div></div>
        <div className="card"><div style={{color: 'var(--muted)'}}>Split Time Mismatch</div><div style={{fontSize: '24px', fontWeight: 700}}>1</div></div>
      </div>
      <div className="card">
        <h2 style={{fontWeight: 700, marginBottom: '16px'}}>Detected Conflicts</h2>
        <table><thead><tr><th>Type</th><th>Description</th><th>Rule Violated</th><th>Action</th></tr></thead><tbody>
          {conflicts.map((c, i) => <tr key={i}>
            <td><span className="badge badge-orange">{c.type}</span></td>
            <td>{c.desc}</td>
            <td>{c.rule}</td>
            <td><button className="btn-outline">Resolve</button></td>
          </tr>)}
        </tbody></table>
      </div>
    </Layout>
  )
}