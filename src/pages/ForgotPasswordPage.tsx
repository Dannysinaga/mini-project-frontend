import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { forgotPassword } from "../services/auth.service";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await forgotPassword({ email });

      setSuccess(
        response?.data?.message || "Reset password link sent successfully"
      );
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to send reset password email"
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
          <span className="badge">ACCOUNT RECOVERY</span>

          <h1 className="premium-login-title">Forgot your password?</h1>

          <p className="premium-login-text">
            Enter your email address and we will send a password reset link so
            you can access your account again.
          </p>

          <div className="stacked-visual-wrap">
            <div className="stacked-main-card">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop"
                alt="Recover account"
              />
              <div className="stacked-main-overlay">
                <span className="badge premium-dark-badge">SECURE ACCESS</span>
                <h3>Get back to your account quickly</h3>
                <p>
                  Reset your password securely and continue booking tickets or
                  managing your events.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-login-right">
          <div className="premium-login-card">
            <div className="premium-login-card-top">
              <div>
                <p className="premium-login-label">PASSWORD RESET</p>
                <h2>Forgot Password</h2>
              </div>
              <div className="premium-login-icon">✦</div>
            </div>

            <p className="muted" style={{ marginTop: 0, marginBottom: 22 }}>
              Enter your email to receive a reset link.
            </p>

            <form onSubmit={handleSubmit} className="premium-login-form">
              <div className="premium-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <div className="error-box">{error}</div>}
              {success && <div className="success-box">{success}</div>}

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPasswordPage;