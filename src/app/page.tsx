"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { login } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await login(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left" />
      <div className="login-right">
        <div className="login-box">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <CalendarDays size={40} color="var(--primary)" />
            <h1 style={{ fontSize: "24px", marginTop: "10px" }}>Automated Timetable Scheduler</h1>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>Sign in to your account</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label">
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label className="label">
                <Lock size={16} /> Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn btn-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--muted)", marginTop: "24px" }}>
            Don&apos;t have an account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}