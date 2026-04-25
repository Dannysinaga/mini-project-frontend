import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getDashboardStats,
  getDashboardChart,
  getDashboardEvents,
  getDashboardAttendees,
} from "../services/dashboard.service";

type DashboardEvent = {
  id: string;
  name: string;
  category?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

const OrganizerDashboardPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendeeLoading, setAttendeeLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsRes, chartRes, eventsRes] = await Promise.all([
        getDashboardStats(),
        getDashboardChart(),
        getDashboardEvents(),
      ]);

      setStats(statsRes || {});
      setChartData(Array.isArray(chartRes) ? chartRes : chartRes?.data || []);
      setEvents(Array.isArray(eventsRes) ? eventsRes : eventsRes?.data || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load organizer dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAttendees = async (eventId: string) => {
    try {
      setSelectedEventId(eventId);
      setAttendeeLoading(true);

      const response = await getDashboardAttendees(eventId);
      setAttendees(Array.isArray(response) ? response : response?.data || []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load attendees"
      );
    } finally {
      setAttendeeLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="page-container">
      <Navbar />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <div className="organizer-hero">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "white",
            }}
          >
            ORGANIZER DASHBOARD
          </span>
          <h1>Track your events and audience insights</h1>
          <p>
            Review performance, monitor attendee activity, and keep your event
            operations organized from one premium dashboard.
          </p>
        </div>

        {error && (
          <div className="error-box" style={{ marginTop: 20 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="premium-card" style={{ marginTop: 24 }}>
            <p className="muted" style={{ margin: 0 }}>
              Loading dashboard...
            </p>
          </div>
        ) : (
          <>
            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card">
                <p>Total Events</p>
                <h2>{stats?.totalEvents ?? 0}</h2>
              </div>

              <div className="dashboard-stat-card">
                <p>Total Transactions</p>
                <h2>{stats?.totalTransactions ?? 0}</h2>
              </div>

              <div className="dashboard-stat-card">
                <p>Total Revenue</p>
                <h2>
                  IDR{" "}
                  {Number(stats?.totalRevenue ?? 0).toLocaleString("id-ID")}
                </h2>
              </div>

              <div className="dashboard-stat-card">
                <p>Total Attendees</p>
                <h2>{stats?.totalAttendees ?? 0}</h2>
              </div>
            </div>

            <div className="dashboard-main-grid">
              <div className="premium-card">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">CHART SUMMARY</p>
                    <h2>Performance Overview</h2>
                  </div>
                </div>

                {chartData?.length > 0 ? (
                  <div className="chart-list">
                    {chartData.map((item: any, index: number) => {
                      const label =
                        item?.label ||
                        item?.month ||
                        item?.date ||
                        `Item ${index + 1}`;
                      const value = Number(item?.value ?? item?.total ?? 0);

                      return (
                        <div className="chart-row" key={index}>
                          <div className="chart-row-top">
                            <span>{label}</span>
                            <strong>{value.toLocaleString("id-ID")}</strong>
                          </div>
                          <div className="chart-bar-track">
                            <div
                              className="chart-bar-fill"
                              style={{
                                width: `${Math.max(
                                  8,
                                  Math.min(100, value > 0 ? value : 8)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="muted" style={{ margin: 0 }}>
                    No chart data available yet.
                  </p>
                )}
              </div>

              <div className="premium-card">
                <div className="section-heading">
                  <div>
                    <p className="section-kicker">YOUR EVENTS</p>
                    <h2>Managed Events</h2>
                  </div>
                </div>

                {events.length > 0 ? (
                  <div className="dashboard-events-list">
                    {events.map((event) => (
                      <div className="dashboard-event-item" key={event.id}>
                        <div>
                          <h3>{event.name}</h3>
                          <p className="muted">
                            {event.category || "-"} • {event.location || "-"}
                          </p>
                          <div className="profile-badges">
                            <span className="soft-badge">
                              {event.status || "ACTIVE"}
                            </span>
                          </div>
                        </div>

                        <button
                          className="dashboard-mini-btn"
                          onClick={() => handleLoadAttendees(event.id)}
                        >
                          View Attendees
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="muted" style={{ margin: 0 }}>
                    No events found.
                  </p>
                )}
              </div>
            </div>

            <div className="premium-card" style={{ marginTop: 24 }}>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">ATTENDEE LIST</p>
                  <h2>
                    {selectedEventId
                      ? "Selected Event Attendees"
                      : "Choose an event to view attendees"}
                  </h2>
                </div>
              </div>

              {attendeeLoading ? (
                <p className="muted" style={{ margin: 0 }}>
                  Loading attendees...
                </p>
              ) : attendees.length > 0 ? (
                <div className="attendee-list">
                  {attendees.map((attendee: any, index: number) => (
                    <div className="attendee-item" key={index}>
                      <div className="attendee-avatar">
                        {(attendee?.fullName ||
                          attendee?.name ||
                          attendee?.email ||
                          "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <h4>
                          {attendee?.fullName ||
                            attendee?.name ||
                            "Unnamed Attendee"}
                        </h4>
                        <p className="muted">
                          {attendee?.email || "No email information"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted" style={{ margin: 0 }}>
                  No attendee data loaded yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrganizerDashboardPage;