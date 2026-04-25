import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { deleteEvent, getOrganizerEvents } from "../services/event.service";
import type { Event } from "../types/event";
import { Link, useNavigate } from "react-router-dom";

const OrganizerManageEventsPage = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      if (!user?.id) {
        setError("You must login first");
        setLoading(false);
        return;
      }

      const data = await getOrganizerEvents(user.id);
      setEvents(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch organizer events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this event?");
    if (!confirmed) return;

    try {
      await deleteEvent(eventId, user.id);
      alert("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  
    return (
  <div className="page-container">
    <Navbar />

    <div className="organizer-hero">
      <span
        className="badge"
        style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
      >
        ORGANIZER PANEL
      </span>
      <h1>Manage your events professionally</h1>
      <p>
        Create new experiences, update ticket offerings, and handle your event
        operations in one dashboard.
      </p>
    </div>

    <div className="manage-header-row">
        <div>
          <span className="badge">ORGANIZER PANEL</span>
          <h1 className="section-title" style={{ marginTop: 12 }}>
            Manage My Events
          </h1>
          <p className="muted page-description">
            Edit, preview, or delete events you have already created.
          </p>
        </div>

        <div className="manage-actions">
          <button onClick={() => navigate("/organizer/create-event")}>
            + Create Event
          </button>
        </div>
      </div>

      {loading && <div className="loading-box">Loading organizer events...</div>}
      {error && <div className="error-box">{error}</div>}

      {!loading && !error && events.length === 0 && (
        <div className="empty-state">
          <h3>No events found</h3>
          <p className="muted">
            You haven’t created any events yet. Start by creating your first event.
          </p>
          <button onClick={() => navigate("/organizer/create-event")}>
            Create First Event
          </button>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="card-grid">
          {events.map((event) => (
            <div className="event-card" key={event.id}>
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
                <span className="badge">{event.category}</span>
                <h3>{event.name}</h3>

                <div>
                  <span className="info-chip">{event.location}</span>
                  <span className="info-chip">
                    {new Date(event.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="action-row">
                  <button onClick={() => navigate(`/organizer/edit-event/${event.id}`)}>
                    Edit
                  </button>

                  <button
                    className="button-secondary"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </button>

                  <Link to={`/events/${event.id}`}>
                    <button className="button-secondary">Preview</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default OrganizerManageEventsPage;