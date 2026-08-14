"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Mail, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signup } from "@/lib/api";

export default function SignupPage() {
  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
if (!email.toLowerCase().endsWith("@gmail.com")) {
      setError("Please use a @gmail.com email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup(email, password);
      router.push("/?signedUp=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
  <div className="login-left-overlay">
    <div className="login-left-content">
      <div className="login-brand">
        <CalendarDays size={32} />
        <span>ExamScheduler</span>
      </div>
      <h2>Automated Exam Timetable Scheduler</h2>
      <p>Generate conflict-free exam schedules in seconds — built for administrators who value precision.</p>
      <div className="login-stats">
        <div>
          <div className="login-stat-value">Zero</div>
          <div className="login-stat-label">Room double-bookings</div>
        </div>
        <div>
          <div className="login-stat-value">Instant</div>
          <div className="login-stat-label">Conflict detection</div>
        </div>
      </div>
    </div>
  </div>
</div>
      <div className="login-right">
        <div className="login-box">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <CalendarDays size={40} color="var(--primary)" />
            <h1 style={{ fontSize: "24px", marginTop: "10px" }}>Create Admin Account</h1>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>
              Automated Exam Timetable Scheduler
            </p>
          </div>
          <form onSubmit={handleSignup}>
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
      placeholder="At least 6 characters"
      required
      style={{ paddingRight: "40px" }}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--muted)",
        display: "flex",
        alignItems: "center",
      }}
      tabIndex={-1}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>
<div className="form-group">
  <label className="label">
    <Lock size={16} /> Confirm Password
  </label>
  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      className="input"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Re-enter your password"
      required
      style={{ paddingRight: "40px" }}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        background: "none",
        border: "none",
        cursor: "pointer",
        color: "var(--muted)",
        display: "flex",
        alignItems: "center",
      }}
      tabIndex={-1}
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>

            {error && (
              <div
                style={{
                  color: "#dc2626",
                  background: "#fef2f2",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginBottom: "16px",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--muted)", marginTop: "20px" }}>
            Already have an account? <Link href="/" style={{ color: "var(--primary)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}