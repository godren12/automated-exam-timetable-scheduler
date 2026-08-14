"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import Link from "next/link";
import { login, verifyLoginCode } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"credentials" | "verify">("credentials");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.twoFactorRequired) {
        setStep("verify");
      } else {
        localStorage.setItem("user", JSON.stringify(result.user));
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const user = await verifyLoginCode(email, code);
      localStorage.setItem("user", JSON.stringify(user));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid or expired code.");
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
            <h1 style={{ fontSize: "24px", marginTop: "10px" }}>
              {step === "credentials" ? "Automated Timetable Scheduler" : "Verify It's You"}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>
              {step === "credentials" ? "Sign in to your account" : `Enter the code sent to ${email}`}
            </p>
          </div>

          {step === "credentials" ? (
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
          ) : (
            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label className="label">
                  <KeyRound size={16} /> Verification Code
                </label>
                <input
                  type="text"
                  className="input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  required
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="btn btn-full" disabled={submitting}>
                {submitting ? "Verifying..." : "Verify & Sign In"}
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", fontSize: "14px", marginBottom: "8px" }}>
            <Link href="/forgot-password" style={{ color: "var(--primary)", fontWeight: 600 }}>Forgot password?</Link>
          </p>
          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--muted)" }}>
            Don&apos;t have an account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: 600 }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}