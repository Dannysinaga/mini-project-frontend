import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { createEvent } from "../services/event.service";

const OrganizerCreateEventPage = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");

  const [ticketName, setTicketName] = useState("Regular");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketQuota, setTicketQuota] = useState("");

  const [vipName, setVipName] = useState("VIP");
  const [vipPrice, setVipPrice] = useState("");
  const [vipQuota, setVipQuota] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert("You must login first");
      navigate("/login");
      return;
    }

    if (user.role !== "ORGANIZER") {
      alert("Only organizer can create events");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await createEvent({
        organizerId: user.id,
        name,
        description,
        category,
        location,
        startDate,
        endDate,
        bannerUrl,
        ticketTypes: [
          {
            name: ticketName,
            price: Number(ticketPrice),
            quota: Number(ticketQuota),
          },
          {
            name: vipName,
            price: Number(vipPrice),
            quota: Number(vipQuota),
          },
        ],
      });

      alert("Event created successfully");
      navigate("/organizer/manage-events");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
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
          Create new experiences, update ticket offerings, and publish your next
          event with a cleaner and more premium workflow.
        </p>
      </div>

      <div className="page-hero">
        <div className="page-hero-content">
          <h1>Create New Event</h1>
          <p>
            Fill in your event details, ticket pricing, and banner to publish
            your next event experience for customers.
          </p>
        </div>

        <div className="page-stat-row">
          <div className="page-stat-card">
            <h3>2</h3>
            <p>Ticket Types</p>
          </div>
          <div className="page-stat-card">
            <h3>Live</h3>
            <p>Publish Ready</p>
          </div>
        </div>
      </div>

      <div className="premium-form-shell">
        <form onSubmit={handleCreateEvent} className="event-form">
          <h2 className="premium-form-section-title">Event Information</h2>

          <input
            type="text"
            placeholder="Event name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            placeholder="Event description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="Banner URL"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
          />

          <h2 className="premium-form-section-title" style={{ marginTop: 8 }}>
            Ticket Offerings
          </h2>

          <div className="ticket-form-grid">
            <div className="premium-ticket-card">
              <h3>Ticket 1</h3>
              <input
                type="text"
                placeholder="Ticket name"
                value={ticketName}
                onChange={(e) => setTicketName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quota"
                value={ticketQuota}
                onChange={(e) => setTicketQuota(e.target.value)}
              />
            </div>

            <div className="premium-ticket-card">
              <h3>Ticket 2</h3>
              <input
                type="text"
                placeholder="Ticket name"
                value={vipName}
                onChange={(e) => setVipName(e.target.value)}
              />
              <input
                type="number"
                placeholder="Price"
                value={vipPrice}
                onChange={(e) => setVipPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Quota"
                value={vipQuota}
                onChange={(e) => setVipQuota(e.target.value)}
              />
            </div>
          </div>

          {error && <div className="error-box">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default OrganizerCreateEventPage;