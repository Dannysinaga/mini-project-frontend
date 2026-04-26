import { useEffect, useState } from "react";
import EventCard from "../components/EventCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getEvents } from "../services/event.service";
import type { Event } from "../types/event";


const HomePage = () => {

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEvents({
          search,
          category,
          location,
        });

        setEvents(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, category, location]);

  return (
    <div className="page-container">
      <Navbar />

      <div className="home-hero">
        <div className="home-hero-left">
          <span className="badge">DISCOVER</span>
          <h1 className="home-hero-title">Find Your Next Experience</h1>
          <p className="home-hero-text">
            Discover concerts, festivals, workshops, and unforgettable event
            experiences in one place. Search by category, keyword, and location.
          </p>

          <div className="home-hero-stats">
            <div className="hero-stat">
              <h3>100+</h3>
              <p>Events Ready</p>
            </div>
            <div className="hero-stat">
              <h3>Fast</h3>
              <p>Booking Flow</p>
            </div>
            <div className="hero-stat">
              <h3>Easy</h3>
              <p>Payment Review</p>
            </div>
          </div>
        </div>

        <div className="home-hero-right">
          <div className="home-hero-overlay">
            <h3>Explore Premium Events</h3>
            <p>
              From live music to workshops and exhibitions, discover curated
              experiences that match your interests.
            </p>
          </div>
        </div>
      </div>

      <div className="search-row">
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter category..."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <h2 className="section-title">Upcoming Events</h2>

      {loading && <div className="loading-box">Loading events...</div>}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && events.length === 0 && (
        <div className="empty-state">
          <h3>No events available</h3>
          <p className="muted">
            Try another keyword, category, or location to find available events.
          </p>
        </div>
      )}

      {!loading && !error && (
        <div className="card-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default HomePage;
