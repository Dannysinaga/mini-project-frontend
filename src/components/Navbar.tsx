import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName =
    user?.profile?.fullName ||
    user?.fullname ||
    user?.email?.split("@")[0] ||
    "User";

  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="lux-navbar-shell">
      <div className="lux-navbar">
        <div className="lux-navbar-left">
          <Link to="/" className="lux-brand-link">
            <div className="lux-brand-mark">✦</div>
            <div>
              <h1 className="lux-brand-title">Eventigo.</h1>
              <p className="lux-brand-subtitle">
                Discover and book your next event
              </p>
            </div>
          </Link>
        </div>

        <div className="lux-navbar-center">
          <nav className="lux-nav-menu">
            <Link className={isActive("/") ? "lux-nav-link active" : "lux-nav-link"} to="/">
              <span>Home</span>
            </Link>

            {user?.role === "CUSTOMER" && (
              <>
                <Link
                  className={
                    isActive("/transactions")
                      ? "lux-nav-link active"
                      : "lux-nav-link"
                  }
                  to="/transactions"
                >
                  <span>My Tickets</span>
                </Link>

                <Link
                  className={isActive("/profile") ? "lux-nav-link active" : "lux-nav-link"}
                  to="/profile"
                >
                  <span>Profile</span>
                </Link>

                <Link
                  className={isActive("/points") ? "lux-nav-link active" : "lux-nav-link"}
                  to="/points"
                >
                  <span>Points</span>
                </Link>
              </>
            )}

            {user?.role === "ORGANIZER" && (
              <>
                <Link
                  className={
                    isActive("/organizer/dashboard")
                      ? "lux-nav-link active"
                      : "lux-nav-link"
                  }
                  to="/organizer/dashboard"
                >
                  <span>Dashboard</span>
                </Link>

                <Link
                  className={
                    isActive("/organizer/create-event")
                      ? "lux-nav-link active"
                      : "lux-nav-link"
                  }
                  to="/organizer/create-event"
                >
                  <span>Create Event</span>
                </Link>

                <Link
                  className={
                    isActive("/organizer/manage-events")
                      ? "lux-nav-link active"
                      : "lux-nav-link"
                  }
                  to="/organizer/manage-events"
                >
                  <span>My Events</span>
                </Link>

                <Link
                  className={
                    isActive("/organizer/pending-transactions")
                      ? "lux-nav-link active"
                      : "lux-nav-link"
                  }
                  to="/organizer/pending-transactions"
                >
                  <span>Pending</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="lux-navbar-right">
          {!user ? (
            <div className="lux-auth-actions">
              <Link to="/login" className="lux-login-btn">
                Login
              </Link>
              <Link to="/register" className="lux-register-btn">
                Register
              </Link>
            </div>
          ) : (
            <div className="lux-user-dropdown" ref={dropdownRef}>
              <button
                className="lux-user-trigger"
                onClick={() => setMenuOpen((prev) => !prev)}
                type="button"
              >
                <div className="lux-user-avatar">{userInitial}</div>
                <div className="lux-user-info">
                  <span className="lux-user-name">{displayName}</span>
                  <span className="lux-user-role">{user?.role}</span>
                </div>
                <span className="lux-user-caret">{menuOpen ? "▴" : "▾"}</span>
              </button>

              {menuOpen && (
                <div className="lux-user-menu">
                  <Link
                    to="/profile"
                    className="lux-user-menu-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  {user?.role === "CUSTOMER" && (
                    <Link
                      to="/points"
                      className="lux-user-menu-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      Points
                    </Link>
                  )}

                  {user?.role === "ORGANIZER" && (
                    <Link
                      to="/organizer/dashboard"
                      className="lux-user-menu-item"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    className="lux-user-menu-item danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;