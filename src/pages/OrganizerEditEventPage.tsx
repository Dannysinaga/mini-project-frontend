import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getEventDetail, updateEvent } from "../services/event.service";

const OrganizerEditEventPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        if (!id) return;
        const event = await getEventDetail(id);

        setName(event.name || "");
        setDescription(event.description || "");
        setCategory(event.category || "");
        setLocation(event.location || "");
        setStartDate(new Date(event.startDate).toISOString().slice(0, 16));
        setEndDate(new Date(event.endDate).toISOString().slice(0, 16));
        setBannerUrl(event.bannerUrl || "");

        if (event.ticketTypes?.[0]) {
          setTicketName(event.ticketTypes[0].name);
          setTicketPrice(String(event.ticketTypes[0].price));
          setTicketQuota(String(event.ticketTypes[0].quota));
        }

        if (event.ticketTypes?.[1]) {
          setVipName(event.ticketTypes[1].name);
          setVipPrice(String(event.ticketTypes[1].price));
          setVipQuota(String(event.ticketTypes[1].quota));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event detail");
      } finally {
        setFetching(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !id) {
      alert("You must login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateEvent(id, {
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

      alert("Event updated successfully");
      navigate("/organizer/manage-events");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="loading-box">Loading event detail...</div>
      </div>
    );
  }

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

    <div className="form-page">
        <div className="form-header">
          <span className="badge">ORGANIZER PANEL</span>
          <h1 className="section-title" style={{ marginTop: 12 }}>
            Edit Event
          </h1>
          <p className="muted page-description">
            Update your event details and ticket offerings before publishing.
          </p>
        </div>

        <div className="form-card">
          <form onSubmit={handleUpdateEvent} className="event-form">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Event name"
            />

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
            />

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
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
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="Banner URL"
            />

            <div className="ticket-form-grid">
              <div className="ticket-mini-card">
                <h3 style={{ marginTop: 0 }}>Ticket 1</h3>
                <input
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Ticket name"
                />
                <input
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(e.target.value)}
                  placeholder="Price"
                />
                <input
                  value={ticketQuota}
                  onChange={(e) => setTicketQuota(e.target.value)}
                  placeholder="Quota"
                />
              </div>

              <div className="ticket-mini-card">
                <h3 style={{ marginTop: 0 }}>Ticket 2</h3>
                <input
                  value={vipName}
                  onChange={(e) => setVipName(e.target.value)}
                  placeholder="Ticket name"
                />
                <input
                  value={vipPrice}
                  onChange={(e) => setVipPrice(e.target.value)}
                  placeholder="Price"
                />
                <input
                  value={vipQuota}
                  onChange={(e) => setVipQuota(e.target.value)}
                  placeholder="Quota"
                />
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Event"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrganizerEditEventPage;