import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { resetPassword } from "../services/auth.service";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!token) {
    setError("Reset token is missing");
    return;
  }

  if (newPassword !== confirmPassword) {
    setError("Password confirmation does not match");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setSuccess("");

    const response = await resetPassword({
      token,
      newPassword,
    });

    setSuccess(response?.message || "Password reset successfully");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  } catch (err: any) {
    console.error(err);
    setError(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to reset password"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="page-container">
      <Navbar />

      <div className="premium-login-layout">
        <div className="premium-login-left">
          <span className="badge">NEW PASSWORD</span>

          <h1 className="premium-login-title">Set your new password</h1>

          <p className="premium-login-text">
            Create a secure new password and continue using your Eventigo
            account safely.
          </p>

          <div className="stacked-visual-wrap">
            <div className="stacked-main-card">
              <img
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop"
                alt="New password"
              />
              <div className="stacked-main-overlay">
                <span className="badge premium-dark-badge">
                  ACCOUNT SECURITY
                </span>
                <h3>Protect your account with a stronger password</h3>
                <p>
                  Use a password that is easy for you to remember and hard for
                  others to guess.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-login-right">
          <div className="premium-login-card">
            <div className="premium-login-card-top">
              <div>
                <p className="premium-login-label">RESET ACCESS</p>
                <h2>Reset Password</h2>
              </div>
              <div className="premium-login-icon">✦</div>
            </div>

            <p className="muted" style={{ marginTop: 0, marginBottom: 22 }}>
              Enter your new password below.
            </p>

            <form onSubmit={handleSubmit} className="premium-login-form">
              <div className="premium-input-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="premium-input-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              {error && <div className="error-box">{error}</div>}
              {success && <div className="success-box">{success}</div>}

              <button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Reset Password"}
              </button>
            </form>

            <div className="premium-login-bottom">
              <p className="muted" style={{ margin: 0 }}>
                Back to login?
              </p>
              <Link to="/login" className="premium-link">
                Login here
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;