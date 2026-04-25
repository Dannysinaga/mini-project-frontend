import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const API_URL = "http://localhost:8000";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
        fullname,
        phone,
        referralCode: referralCode || undefined,
      });

      alert("Register berhasil");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Register gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="page-container">
      <Navbar />

      <div className="auth-wrapper">
        <div className="auth-left">
  <span className="badge">JOIN NOW</span>
  <h1 className="auth-title">Create your account</h1>
  <p className="muted">
    Register as a customer to book tickets and explore events.
  </p>

  <div className="premium-login-image-card">
    <img
      src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400&auto=format&fit=crop"
      alt="People enjoying event"
    />
    <div className="premium-login-image-overlay">
      <span className="badge premium-dark-badge">START YOUR JOURNEY</span>
      <h3>Join exciting events with one account</h3>
      <p>
        Create your account to explore events, book tickets, upload payment proof,
        and manage your event experience more easily.
      </p>
    </div>
  </div>
</div>
        
        

        <div className="auth-card">
          <h2 style={{ marginTop: 0 }}>Register</h2>
          

          <form onSubmit={handleRegister} className="auth-form">
            <input
              type="text"
              placeholder="Full name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="text"
              placeholder="Referral code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />

            {error && <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Register"}
            </button>
          </form>
        </div>
      </div>
      

      <Footer />
    </div>
  );
};

export default RegisterPage;