"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Mail, KeyRound, Lock } from "lucide-react";
import { forgotPassword, resetPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);
    try {
      const msg = await forgotPassword(email);
      setMessage(typeof msg === "string" ? msg : "If that email exists, a reset code has been sent.");
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email, code, newPassword);
      setMessage("Password reset successfully. You can now log in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
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
            <h2>Reset Your Password</h2>
            <p>Enter your email and we&apos;ll send you a code to reset your password.</p>
          </div>
        </div>
      </div>
      <div className="login-right">
        <div className="login-box">
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <CalendarDays size={40} color="var(--primary)" />
            <h1 style={{ fontSize: "24px", marginTop: "10px" }}>
              {step === "request" ? "Forgot Password" : "Reset Password"}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: "14px" }}>
              {step === "request" ? "We'll email you a reset code" : "Enter the code and your new password"}
            </p>
          </div>

          {step === "request" ? (
            <form onSubmit={handleRequestCode}>
              <div className="form-group">
                <label className="label">
                  <Mail size={16} /> Email Address
                </label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your gmail address"
                  required
                />
              </div>

              {error && <div className="form-error">{error}</div>}
              {message && (
                <div style={{ color: "#065f46", background: "#d1fae5", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
                  {message}
                </div>
              )}

              <button type="submit" className="btn btn-full" disabled={submitting}>
                {submitting ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="label">
                  <KeyRound size={16} /> Reset Code
                </label>
                <input
                  type="text"
                  className="input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code from your email"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">
                  <Lock size={16} /> New Password
                </label>
                <input
                  type="password"
                  className="input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">
                  <Lock size={16} /> Confirm New Password
                </label>
                <input
                  type="password"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {error && <div className="form-error">{error}</div>}
              {message && (
                <div style={{ color: "#065f46", background: "#d1fae5", padding: "10px 14px", borderRadius: "8px", fontSize: "14px", marginBottom: "16px" }}>
                  {message}
                </div>
              )}

              <button type="submit" className="btn btn-full" disabled={submitting}>
                {submitting ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          <p style={{ textAlign: "center", fontSize: "14px", color: "var(--muted)", marginTop: "24px" }}>
            <Link href="/" style={{ color: "var(--primary)", fontWeight: 600 }}>Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}