import { Link } from "react-router-dom";
import type { Event } from "../types/event";

interface EventCardProps {
  event: Event;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop";

const EventCard = ({ event }: EventCardProps) => {
  const lowestPrice =
    event.ticketTypes && event.ticketTypes.length > 0
      ? Math.min(...event.ticketTypes.map((ticket) => ticket.price))
      : 0;

  return (
    <div className="event-card">
      <img
        className="image-thumb"
        src={event.bannerUrl || FALLBACK_IMAGE}
        alt={event.name}
        onError={(e) => {
          e.currentTarget.src = FALLBACK_IMAGE;
        }}
      />

      <div className="event-card-content">
        <span className="badge">{event.category}</span>

        <h3>{event.name}</h3>

        <p className="muted" style={{ minHeight: 78 }}>
          {event.description || "Discover an amazing event experience."}
        </p>

        <p className="event-meta">
          {new Date(event.startDate).toLocaleDateString()} • {event.location}
        </p>

        <div className="event-bottom">
          <span className="price-text">
            From IDR {lowestPrice.toLocaleString()}
          </span>

          <Link to={`/events/${event.id}`}>
            <button>See Detail</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;