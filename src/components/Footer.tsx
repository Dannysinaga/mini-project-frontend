import { Link } from "react-router-dom";

const Footer = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const isGuest = !user;
  const isCustomer = user?.role === "CUSTOMER";
  const isOrganizer = user?.role === "ORGANIZER";

  return (
    <footer className="premium-footer">
      <div className="premium-footer-top">
        <div className="premium-footer-brand">
          <h2>Eventigo.</h2>
          <p>
            Discover events, book tickets, and manage your experience with a
            smoother and more premium platform.
          </p>
        </div>

        {isGuest && (
          <div className="premium-footer-links">
            <div>
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
            <div>
              <h4>Explore</h4>
              <Link to="/">Events</Link>
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
          </div>
        )}

        {isCustomer && (
          <div className="premium-footer-links">
            <div>
              <h4>Customer</h4>
              <Link to="/">Home</Link>
              
              <Link to="/profile">Profile</Link>
              <Link to="/points">Points</Link>
              
            </div>
            <div>
              <h4>Support</h4>
              <Link to="/forgot-password">Reset Password</Link>
            </div>
          </div>
        )}

        {isOrganizer && (
          <div className="premium-footer-links">
            <div>
              <h4>Organizer</h4>
              <Link to="/organizer/dashboard">Dashboard</Link>
              <Link to="/organizer/pending-transactions">Pending</Link>
            </div>
            <div>
              <h4>Account</h4>
              <Link to="/profile">Profile</Link>
              <Link to="/forgot-password">Reset Password</Link>
            </div>
          </div>
        )}
      </div>

      <div className="premium-footer-bottom">
        <p>© 2026 Eventigo. All rights reserved.</p>
        <div className="premium-footer-socials">
          <span>IG</span>
          <span>WA</span>
          <span>Mail</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;