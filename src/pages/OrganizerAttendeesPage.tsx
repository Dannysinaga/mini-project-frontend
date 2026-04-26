import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getDashboardAttendees } from "../services/dashboard.service";

type Attendee = {
  name?: string;
  fullName?: string;
  email?: string;
  ticketType?: string;
  ticketPrice?: number;
  quantity?: number;
  totalPrice?: number;
  purchasedAt?: string;
};

const OrganizerAttendeesPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAttendees = async () => {
    try {
      if (!eventId) {
        setError("Event ID not found");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const data = await getDashboardAttendees(eventId);
      setAttendees(Array.isArray(data) ? data : data?.data || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load attendees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, [eventId]);

  const totalTickets = attendees.reduce(
    (sum, attendee) => sum + Number(attendee.quantity || 0),
    0
  );

  const totalRevenue = attendees.reduce(
    (sum, attendee) => sum + Number(attendee.totalPrice || 0),
    0
  );

  return (
    <div className="page-container">
      <Navbar />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="organizer-hero">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "white",
            }}
          >
            ATTENDEE LIST
          </span>

          <h1>View event attendees</h1>
          <p>
            Review customers who purchased tickets, ticket types, quantity, and
            total purchase value.
          </p>
        </div>

        <div className="attendees-top-actions">
          <button
            type="button"
            className="button-secondary"
            onClick={() => navigate("/organizer/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {loading && (
          <div className="premium-card" style={{ marginTop: 24 }}>
            <p className="muted" style={{ margin: 0 }}>
              Loading attendees...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="error-box" style={{ marginTop: 24 }}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="dashboard-stats-grid" style={{ marginTop: 24 }}>
              <div className="dashboard-stat-card dashboard-stat-polished">
                <p>Total Attendees</p>
                <h2>{attendees.length}</h2>
                <span>Customer purchase records</span>
              </div>

              <div className="dashboard-stat-card dashboard-stat-polished">
                <p>Total Tickets</p>
                <h2>{totalTickets}</h2>
                <span>Total ticket quantity</span>
              </div>

              <div className="dashboard-stat-card dashboard-stat-polished">
                <p>Total Revenue</p>
                <h2>IDR {totalRevenue.toLocaleString("id-ID")}</h2>
                <span>From this event</span>
              </div>
            </div>

            {attendees.length === 0 ? (
              <div
                className="premium-card transaction-empty-state"
                style={{ marginTop: 24 }}
              >
                <h2>No attendees yet</h2>
                <p className="muted">
                  Attendees will appear here after customers complete ticket
                  transactions.
                </p>
              </div>
            ) : (
              <div className="premium-card attendees-page-card">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">ATTENDEES</p>
                    <h2>Purchased Ticket List</h2>
                  </div>
                </div>

                <div className="attendees-table-wrap">
                  <table className="attendees-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Ticket</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Purchased At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendees.map((attendee, index) => (
                        <tr key={`${attendee.email}-${index}`}>
                          <td>
                            <div className="attendee-user-cell">
                              <div className="attendee-avatar">
                                {(attendee.name ||
                                  attendee.fullName ||
                                  attendee.email ||
                                  "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {attendee.name ||
                                    attendee.fullName ||
                                    "Unnamed Attendee"}
                                </strong>
                                <span>Customer</span>
                              </div>
                            </div>
                          </td>

                          <td>{attendee.email || "-"}</td>

                          <td>
                            <span className="soft-badge">
                              {attendee.ticketType || "-"}
                            </span>
                          </td>

                          <td>{attendee.quantity || 0}</td>

                          <td>
                            IDR{" "}
                            {Number(attendee.totalPrice || 0).toLocaleString(
                              "id-ID"
                            )}
                          </td>

                          <td>
                            {attendee.purchasedAt
                              ? new Date(attendee.purchasedAt).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrganizerAttendeesPage;