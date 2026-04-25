import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getEventDetail } from "../services/event.service";
import { createTransaction } from "../services/transaction.service";
import type { Event } from "../types/event";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        setLoading(true);
        setError("");
        const data = await getEventDetail(id);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch event detail");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const increaseQty = (ticketId: string, maxQty: number) => {
    setSelectedTickets((prev) => {
      const currentQty = prev[ticketId] || 0;
      if (currentQty >= maxQty) return prev;

      return {
        ...prev,
        [ticketId]: currentQty + 1,
      };
    });
  };

  const decreaseQty = (ticketId: string) => {
    setSelectedTickets((prev) => {
      const currentQty = prev[ticketId] || 0;
      if (currentQty <= 0) return prev;

      return {
        ...prev,
        [ticketId]: currentQty - 1,
      };
    });
  };

const handleGetTickets = async () => {
  if (!event) return;

  if (!user?.id) {
    alert("You must login first");
    navigate("/login");
    return;
  }

  const items = Object.entries(selectedTickets)
    .filter(([, quantity]) => quantity > 0)
    .map(([ticketTypeId, quantity]) => ({
      ticketTypeId,
      quantity,
    }));

  if (items.length === 0) {
    alert("Please select at least one ticket");
    return;
  }

  try {
    setSubmitting(true);

    await createTransaction({
      userId: user.id,
      eventId: event.id,
      items,
    });

    alert("Transaction created successfully");
    navigate("/transactions");
  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || "Failed to create transaction");
  } finally {
    setSubmitting(false);
  }
};

  if (loading) return <p style={{ padding: 24 }}>Loading event detail...</p>;
  if (error) return <p style={{ padding: 24 }}>{error}</p>;
  if (!event) return <p style={{ padding: 24 }}>Event not found</p>;

  return (
    <div className="page-container">
      <Navbar />

      <div className="detail-layout">
        <div className="detail-main">
          <img
            className="hero-image"
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

          <div
            className="event-card-content"
            style={{ background: "white", borderRadius: 18 }}
          >
            <span className="badge">{event.category}</span>
            <h1 style={{ marginTop: 8 }}>{event.name}</h1>
            <p className="muted">{event.description}</p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(event.startDate).toLocaleString()} -{" "}
              {new Date(event.endDate).toLocaleString()}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            <p>
              <strong>Organizer:</strong>{" "}
              {event.organizer?.profile?.fullName || event.organizer?.email}
            </p>
          </div>

          <div>
            <h2 className="section-title">Ticket Types</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {event.ticketTypes?.map((ticket) => {
                const qty = selectedTickets[ticket.id] || 0;

                return (
                  <div className="ticket-box" key={ticket.id}>
                    <div>
                      <h3 style={{ margin: 0 }}>{ticket.name}</h3>
                      <p className="muted" style={{ marginBottom: 0 }}>
                        Price: IDR {ticket.price.toLocaleString()}
                      </p>
                      <p className="muted">Available: {ticket.availableQuota}</p>
                    </div>

                    <div className="ticket-actions">
                      <button
                        className="button-secondary"
                        onClick={() => decreaseQty(ticket.id)}
                      >
                        -
                      </button>
                      <span>{qty}</span>
                      <button
                        className="button-secondary"
                        onClick={() =>
                          increaseQty(ticket.id, ticket.availableQuota)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 20 }}>
              <button
                style={{ width: "100%", padding: "14px 16px" }}
                onClick={handleGetTickets}
                disabled={submitting}
              >
                {submitting ? "Processing..." : "Get Tickets"}
              </button>
            </div>
          </div>
        </div>

        <div className="detail-side">
          <div className="side-box" style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0 }}>Event Highlights</h3>
            <ul className="muted" style={{ paddingLeft: 18 }}>
              <li>Live performances</li>
              <li>Food festival</li>
              <li>Special guest appearances</li>
              <li>Interactive crowd experience</li>
            </ul>
          </div>

          <div className="side-box" style={{ padding: 18 }}>
            <h3 style={{ marginTop: 0 }}>Location</h3>
            <p>{event.location}</p>
            <p className="muted">Map preview can be added later.</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EventDetailPage;