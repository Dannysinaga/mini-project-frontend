import { useNavigate } from "react-router-dom";
import type { Event } from "../types/event";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const reviews = (event as any).reviews || [];

  const averageRating =
    Array.isArray(reviews) && reviews.length > 0
      ? reviews.reduce(
          (sum: number, review: any) => sum + Number(review.rating || 0),
          0
        ) / reviews.length
      : 0;

  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  const ticketTypes = event.ticketTypes || [];

  const minimumPrice =
    ticketTypes.length > 0
      ? Math.min(...ticketTypes.map((ticket) => Number(ticket.price || 0)))
      : 0;

  return (
    <div className="event-card">
      <img
        className="event-card-image"
        src={
          event.bannerUrl ||
          "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop"
        }
        alt={event.name}
        onError={(e) => {
          e.currentTarget.src =
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1200&auto=format&fit=crop";
        }}
      />

      <div className="event-card-content">
        <span className="badge">{event.category}</span>

        <div className="event-card-rating">
          <span>★ {averageRating.toFixed(1)}</span>
          <small>{reviewCount} reviews</small>
        </div>

        <h3>{event.name}</h3>

        <p className="muted">{event.description}</p>

        <p className="muted">
          {new Date(event.startDate).toLocaleDateString("id-ID")} •{" "}
          {event.location}
        </p>

        <div className="event-card-bottom">
          <strong>
            {minimumPrice > 0
              ? `From IDR ${minimumPrice.toLocaleString("id-ID")}`
              : "Free"}
          </strong>

          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
          >
            See Detail
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;