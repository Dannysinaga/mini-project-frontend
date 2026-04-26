import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getDashboardStats,
  getDashboardChart,
  getDashboardEvents,
  deleteDashboardEvent,
} from "../services/dashboard.service";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatIDR = (value: number) => {
  return `IDR ${Number(value || 0).toLocaleString("id-ID")}`;
};

const OrganizerDashboardPage = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");

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

      const rawChart = Array.isArray(chartRes)
        ? chartRes
        : chartRes?.data || [];

      setChartData(rawChart);

      const rawEvents = Array.isArray(eventsRes)
        ? eventsRes
        : eventsRes?.data || [];

      setEvents(rawEvents);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load organizer dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      setActionLoadingId(eventId);
      await deleteDashboardEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Delete failed"
      );
    } finally {
      setActionLoadingId("");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const normalizedChartData = useMemo(() => {
    if (!Array.isArray(chartData)) return [];

    return chartData.map((item: any, index: number) => {
      const label =
        item?.label ||
        item?.monthName ||
        (item?.month ? monthNames[Number(item.month) - 1] : undefined) ||
        `M${index + 1}`;

      const value = Number(
        item?.value ??
          item?.revenue ??
          item?.totalRevenue ??
          item?.total ??
          item?.amount ??
          0
      );

      return {
        label,
        value,
      };
    });
  }, [chartData]);

  const maxChartValue = useMemo(() => {
    const max = Math.max(...normalizedChartData.map((item) => item.value), 0);
    return max || 1;
  }, [normalizedChartData]);

  return (
    <div className="page-container">
      <Navbar />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="organizer-hero dashboard-hero-polished">
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
            Monitor event performance, revenue, ticket sales, and attendees from
            one clean dashboard.
          </p>
        </div>

        {loading ? (
          <div className="premium-card dashboard-loading-card">
            <p className="muted" style={{ margin: 0 }}>
              Loading dashboard...
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="error-box" style={{ marginTop: 20 }}>
                {error}
              </div>
            )}

            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card dashboard-stat-polished">
                <p>Total Events</p>
                <h2>{stats?.totalEvents ?? 0}</h2>
                <span>Published and managed events</span>
              </div>

              <div className="dashboard-stat-card dashboard-stat-polished">
                <p>Total Transactions</p>
                <h2>{stats?.totalTransactions ?? 0}</h2>
                <span>Successful ticket orders</span>
              </div>

              <div className="dashboard-stat-card dashboard-stat-polished">
                <p>Total Revenue</p>
                <h2>{formatIDR(stats?.totalRevenue ?? 0)}</h2>
                <span>Revenue from completed orders</span>
              </div>

              <div className="dashboard-stat-card dashboard-stat-polished">
                <p>Total Attendees</p>
                <h2>{stats?.totalAttendees ?? 0}</h2>
                <span>Confirmed ticket quantity</span>
              </div>
            </div>

            <div className="premium-card dashboard-chart-card">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">REVENUE CHART</p>
                  <h2>Monthly Revenue Overview</h2>
                </div>

                <div className="chart-total-chip">
                  {formatIDR(stats?.totalRevenue ?? 0)}
                </div>
              </div>

              <div className="manual-chart">
                {normalizedChartData.map((item, index) => {
                  const heightPercent = Math.max(
                    item.value > 0 ? 12 : 3,
                    (item.value / maxChartValue) * 100
                  );

                  return (
                    <div className="manual-chart-item" key={index}>
                      <div className="manual-chart-bar-area">
                        <div
                          className="manual-chart-bar"
                          style={{ height: `${heightPercent}%` }}
                          title={`${item.label}: ${formatIDR(item.value)}`}
                        />
                      </div>

                      <span className="manual-chart-label">{item.label}</span>

                      <strong className="manual-chart-value">
                        {item.value > 0
                          ? `${Math.round(item.value / 1000).toLocaleString(
                              "id-ID"
                            )}K`
                          : "0"}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="dashboard-events-section">
              <div className="section-heading" style={{ marginBottom: 18 }}>
                <div>
                  <p className="section-kicker">YOUR EVENTS</p>
                  <h2>Managed Events</h2>
                </div>
                <button
  className="button-secondary"
  onClick={() => navigate("/organizer/vouchers")}
>
  + Create Voucher
</button>

                <button onClick={() => navigate("/organizer/create-event")}>
                  + Create Event
                </button>
              </div>

              {events.length > 0 ? (
                <div className="card-grid dashboard-event-grid-polished">
                  {events.map((event) => (
                    <div className="event-card dashboard-event-card" key={event.id}>
                      <img
                        className="image-thumb"
                        src={
                          event.bannerUrl ||
                          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt={event.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop";
                        }}
                      />

                      <div className="event-card-content">
                        <div className="dashboard-event-card-top">
                          <span className="badge">
                            {event.category || "Event"}
                          </span>
                          <span className="soft-badge">
                            {event.status || "PUBLISHED"}
                          </span>
                        </div>

                        <h3>{event.name}</h3>

                        <div className="manage-event-meta-row">
                          <span className="info-chip">
                            {event.location || "-"}
                          </span>
                          <span className="info-chip">
                            {event.startDate
                              ? new Date(event.startDate).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>

                        <div className="dashboard-event-mini-info">
                          <span>
                            Sold:{" "}
                            <strong>{event.totalSold ?? event.sold ?? 0}</strong>
                          </span>
                          <span>{event.priceRange || "Ticket pricing"}</span>
                        </div>

                        <div className="action-row dashboard-event-actions-polished">
                          <button
                            onClick={() =>
                              navigate(`/organizer/edit-event/${event.id}`)
                            }
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/organizer/event/${event.id}/attendees`)
                            }
                          >
                            View Attendees
                          </button>

                          <button
                            className="button-secondary danger-soft-btn"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={actionLoadingId === event.id}
                          >
                            {actionLoadingId === event.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="premium-card transaction-empty-state">
                  <h2>No events found</h2>
                  <p className="muted">
                    Create your first event to start selling tickets.
                  </p>
                  <button
                    style={{ marginTop: 16 }}
                    onClick={() => navigate("/organizer/create-event")}
                  >
                    Create Event
                  </button>
                </div>
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