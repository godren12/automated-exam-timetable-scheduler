"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleLogin = (e: React.FormEvent) => { e.preventDefault(); router.push("/dashboard"); };

  return (
    <div className="login-page">
      <div className="login-left" />
      <div className="login-right">
        <div className="login-box">
          <div style={{textAlign: 'center', marginBottom: '24px'}}>
            <CalendarDays size={40} color="var(--primary)" />
            <h1 style={{fontSize: '24px', marginTop: '10px'}}>Automated Timetable Scheduler</h1>
            <p style={{color: 'var(--muted)', fontSize: '14px'}}>Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group"><label className="label"><Mail size={16} /> Email Address</label><input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required /></div>
            <div className="form-group"><label className="label"><Lock size={16} /> Password</label><input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required /></div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '16px'}}><label><input type="checkbox" /> Remember me</label><a href="#" style={{color: 'var(--primary)'}}>Forgot password?</a></div>
            <button type="submit" className="btn" style={{width: '100%', justifyContent: 'center'}}>Sign In</button>
          </form>
          <p style={{textAlign: 'center', fontSize: '12px', color: 'var(--muted)', marginTop: '24px'}}>© 2025 Automated Timetable Scheduler</p>
        </div>
      </div>
    </div>
  )
}