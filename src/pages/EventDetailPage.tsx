import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getEventDetail } from "../services/event.service";
import { createTransaction } from "../services/transaction.service";
import { getEventReviews, type Review } from "../services/review.service";
import type { Event } from "../types/event";

const WELCOME_COUPON_PREVIEW = 20000;
const VOUCHER_PREVIEW = 30000;

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
  const [usedPoints, setUsedPoints] = useState(0);
  const [transactionError, setTransactionError] = useState("");
  const [transactionSuccess, setTransactionSuccess] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [voucherError, setVoucherError] = useState("");
  const [voucherMessage, setVoucherMessage] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!id) return;

        const data = await getEventReviews(id);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("FETCH REVIEWS ERROR:", err);
      }
    };

    fetchReviews();
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

  const selectedItems = useMemo(() => {
    if (!event?.ticketTypes) return [];

    return Object.entries(selectedTickets)
      .filter(([, quantity]) => quantity > 0)
      .map(([ticketTypeId, quantity]) => {
        const ticket = event.ticketTypes.find((t) => t.id === ticketTypeId);

        return {
          ticketTypeId,
          quantity,
          ticket,
        };
      })
      .filter((item) => item.ticket);
  }, [selectedTickets, event]);

  const subtotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => {
      return sum + ((item.ticket?.price || 0) * item.quantity);
    }, 0);
  }, [selectedItems]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        reviews.length
      : 0;

  const availablePoints = Number(user?.points || 0);

  const couponDiscount = couponApplied
    ? Math.min(WELCOME_COUPON_PREVIEW, subtotal)
    : 0;

  const voucherDiscount = voucherApplied
    ? Math.min(VOUCHER_PREVIEW, Math.max(subtotal - couponDiscount, 0))
    : 0;

  const amountAfterDiscount = Math.max(
    subtotal - couponDiscount - voucherDiscount,
    0
  );

  const maxUsablePoints = Math.min(availablePoints, amountAfterDiscount);
  const safeUsedPoints = Math.min(Math.max(usedPoints, 0), maxUsablePoints);
  const finalTotal = Math.max(amountAfterDiscount - safeUsedPoints, 0);

  const handleApplyCoupon = () => {
    setCouponError("");
    setCouponMessage("");

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (subtotal <= 0) {
      setCouponError("Please select a ticket before applying coupon.");
      return;
    }

    setCouponApplied(true);
    setCouponMessage(
      "Coupon will be validated by backend when you create transaction."
    );
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setCouponCode("");
    setCouponError("");
    setCouponMessage("");
  };

  const handleApplyVoucher = () => {
    setVoucherError("");
    setVoucherMessage("");

    if (!voucherCode.trim()) {
      setVoucherError("Please enter a voucher code.");
      return;
    }

    if (subtotal <= 0) {
      setVoucherError("Please select a ticket before applying voucher.");
      return;
    }

    setVoucherApplied(true);
    setVoucherMessage(
      "Voucher will be validated by backend when you create transaction."
    );
  };

  const handleRemoveVoucher = () => {
    setVoucherApplied(false);
    setVoucherCode("");
    setVoucherError("");
    setVoucherMessage("");
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
      setTransactionError("");
      setTransactionSuccess("");

      const response = await createTransaction({
        userId: user.id,
        eventId: event.id,
        usedPoints: safeUsedPoints,
        couponCode: couponApplied ? couponCode.trim() : undefined,
        voucherCode: voucherApplied ? voucherCode.trim() : undefined,
        items,
      });

      setTransactionSuccess(
        response?.message || "Transaction created successfully"
      );

      const updatedUser = {
        ...user,
        points: Math.max((user?.points || 0) - safeUsedPoints, 0),
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate("/transactions");
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setTransactionError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to create transaction"
      );
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

            <div className="event-rating-mini">
              <span>★ {averageRating.toFixed(1)}</span>
              <small>{reviews.length} reviews</small>
            </div>

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
                        Price: IDR {ticket.price.toLocaleString("id-ID")}
                      </p>

                      <p className="muted">
                        Available: {ticket.availableQuota}
                      </p>
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

            <div className="premium-card" style={{ marginTop: 24 }}>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">CHECKOUT</p>
                  <h2>Order Summary</h2>
                </div>
              </div>

              <div className="coupon-box">
                <div className="coupon-box-header">
                  <div>
                    <p className="section-kicker" style={{ marginBottom: 6 }}>
                      COUPON
                    </p>
                    <h3>Welcome Coupon</h3>
                    <p className="muted">
                      Enter your personal welcome coupon from My Rewards page.
                    </p>
                  </div>
                </div>

                <div className="coupon-input-row">
                  <input
                    type="text"
                    value={couponCode}
                    disabled={couponApplied}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCouponError("");
                      setCouponMessage("");
                    }}
                    placeholder="Example: WELCOME123"
                  />

                  {couponApplied ? (
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </button>
                  ) : (
                    <button type="button" onClick={handleApplyCoupon}>
                      Apply
                    </button>
                  )}
                </div>

                {couponMessage && (
                  <div className="success-box" style={{ marginTop: 12 }}>
                    {couponMessage}
                  </div>
                )}

                {couponError && (
                  <div className="error-box" style={{ marginTop: 12 }}>
                    {couponError}
                  </div>
                )}
              </div>

              <div className="voucher-checkout-box">
                <div className="coupon-box-header">
                  <div>
                    <p className="section-kicker" style={{ marginBottom: 6 }}>
                      VOUCHER
                    </p>
                    <h3>Punya Voucher?</h3>
                    <p className="muted">
                      Enter event voucher code from organizer, for example
                      DISKON20.
                    </p>
                  </div>
                </div>

                <div className="coupon-input-row">
                  <input
                    type="text"
                    value={voucherCode}
                    disabled={voucherApplied}
                    onChange={(e) => {
                      setVoucherCode(e.target.value.toUpperCase());
                      setVoucherError("");
                      setVoucherMessage("");
                    }}
                    placeholder="Example: DISKON20"
                  />

                  {voucherApplied ? (
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={handleRemoveVoucher}
                    >
                      Remove
                    </button>
                  ) : (
                    <button type="button" onClick={handleApplyVoucher}>
                      Apply
                    </button>
                  )}
                </div>

                {voucherMessage && (
                  <div className="success-box" style={{ marginTop: 12 }}>
                    {voucherMessage}
                  </div>
                )}

                {voucherError && (
                  <div className="error-box" style={{ marginTop: 12 }}>
                    {voucherError}
                  </div>
                )}
              </div>

              <div className="premium-input-group">
                <label>Available Points</label>
                <input
                  type="text"
                  value={availablePoints.toLocaleString("id-ID")}
                  disabled
                />
              </div>

              <div className="premium-input-group">
                <label>Use Points</label>
                <input
                  type="number"
                  min={0}
                  max={maxUsablePoints}
                  value={usedPoints}
                  onChange={(e) => setUsedPoints(Number(e.target.value) || 0)}
                  placeholder="Enter points to use"
                />
                <small className="muted">
                  Maximum usable points:{" "}
                  {maxUsablePoints.toLocaleString("id-ID")}
                </small>
              </div>

              <div className="checkout-summary-box">
                <div className="checkout-summary-row">
                  <span>Subtotal</span>
                  <strong>IDR {subtotal.toLocaleString("id-ID")}</strong>
                </div>

                <div className="checkout-summary-row">
                  <span>Coupon Discount</span>
                  <strong>
                    - IDR {couponDiscount.toLocaleString("id-ID")}
                  </strong>
                </div>

                <div className="checkout-summary-row">
                  <span>Voucher Discount</span>
                  <strong>
                    - IDR {voucherDiscount.toLocaleString("id-ID")}
                  </strong>
                </div>

                <div className="checkout-summary-row">
                  <span>Points Discount</span>
                  <strong>
                    - IDR {safeUsedPoints.toLocaleString("id-ID")}
                  </strong>
                </div>

                <div className="checkout-summary-row total">
                  <span>Final Total</span>
                  <strong>IDR {finalTotal.toLocaleString("id-ID")}</strong>
                </div>
              </div>

              {transactionError && (
                <div className="error-box" style={{ marginTop: 16 }}>
                  {transactionError}
                </div>
              )}

              {transactionSuccess && (
                <div className="success-box" style={{ marginTop: 16 }}>
                  {transactionSuccess}
                </div>
              )}

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

            <div className="premium-card reviews-section" style={{ marginTop: 24 }}>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">REVIEWS & RATINGS</p>
                  <h2>Event Reviews</h2>
                </div>

                <div className="review-score-box">
                  <strong>{averageRating.toFixed(1)}</strong>
                  <span>★</span>
                  <small>{reviews.length} reviews</small>
                </div>
              </div>

              <div className="review-form-box">
                <h3>Want to write a review?</h3>
                <p className="muted">
                  Reviews can be submitted from My Tickets after your
                  transaction is DONE and the event has finished.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/transactions")}
                  style={{ marginTop: 12 }}
                >
                  Go to My Tickets
                </button>
              </div>

              <div className="review-list">
                {reviews.length === 0 ? (
                  <div className="review-empty">
                    <h3>No reviews yet</h3>
                    <p className="muted">
                      Reviews will appear here after customers submit their
                      feedback.
                    </p>
                  </div>
                ) : (
                  reviews.map((review) => {
                    const reviewerName =
                      review.user?.profile?.fullName ||
                      review.user?.email?.split("@")[0] ||
                      "Customer";

                    return (
                      <div className="review-item" key={review.id}>
                        <div className="review-avatar">
                          {reviewerName.charAt(0).toUpperCase()}
                        </div>

                        <div className="review-content">
                          <div className="review-top">
                            <div>
                              <h4>{reviewerName}</h4>
                              <p className="muted">
                                {review.createdAt
                                  ? new Date(review.createdAt).toLocaleString()
                                  : "Recently"}
                              </p>
                            </div>

                            <div className="review-stars">
                              {"★".repeat(review.rating)}
                              {"☆".repeat(5 - review.rating)}
                            </div>
                          </div>

                          <p>{review.comment || "No comment provided."}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
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