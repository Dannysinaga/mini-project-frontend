import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { login } from "../services/auth.service";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const response = await login({ email, password });

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user));

    if (response.user.role === "ORGANIZER") {
      navigate("/organizer/pending-transactions");
    } else {
      navigate("/");
    }
  } catch (err: any) {
    console.error(err);
    setError(
      err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Login gagal"
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
          <span className="badge">WELCOME BACK</span>

          <h1 className="premium-login-title">
            Continue your event journey with Eventigo.
          </h1>

          <p className="premium-login-text">
            Book tickets, manage transactions, and explore amazing events in one
            seamless experience. Everything is ready in one dashboard.
          </p>

          <div className="premium-login-stats">
            <div className="premium-stat-card">
              <h3>Fast Booking</h3>
              <p className="muted">
                Choose tickets, complete payment, and access events quickly.
              </p>
            </div>

            <div className="premium-stat-card">
              <h3>Organizer Tools</h3>
              <p className="muted">
                Create events, manage tickets, and review approvals with ease.
              </p>
            </div>

            <div className="premium-stat-card">
              <h3>All in One</h3>
              <p className="muted">
                Browse events, upload proof of payment, and track status in one
                place.
              </p>
            </div>
          </div>

          <div className="stacked-visual-wrap">
            <div className="stacked-main-card">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1400&auto=format&fit=crop"
                alt="Purple concert lights"
              />
              <div className="stacked-main-overlay">
                <span className="badge premium-dark-badge">
                  PREMIUM EXPERIENCE
                </span>
                <h3>Discover events that feel unforgettable</h3>
                <p>
                  Music festivals, conferences, and creative experiences — all
                  in one elegant platform.
                </p>
              </div>
            </div>

            <div className="stacked-floating-card">
              <img
                src="https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=900&auto=format&fit=crop"
                alt="Purple event stage"
              />
              <div className="stacked-floating-content">
                <h4>Live events &amp; pro networking</h4>
                <p>Find curated experiences for every interest.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="premium-login-right">
          <div className="premium-login-card">
            <div className="premium-login-card-top">
              <div>
                <p className="premium-login-label">ACCOUNT ACCESS</p>
                <h2>Login</h2>
              </div>
              <div className="premium-login-icon">✦</div>
            </div>

            <p className="muted" style={{ marginTop: 0, marginBottom: 22 }}>
              Enter your email and password to continue.
            </p>

            <form onSubmit={handleLogin} className="premium-login-form">
              <div className="premium-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="premium-input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <div className="error-box">{error}</div>}

              <button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Login"}
              </button>
            </form>

            <div style={{ marginTop: 12 }}>
              <Link to="/forgot-password" className="premium-link">
                Forgot Password?
              </Link>
            </div>

            <div className="premium-login-bottom">
              <p className="muted" style={{ margin: 0 }}>
                Don&apos;t have an account?
              </p>
              <Link to="/register" className="premium-link">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;