import { useEffect, useMemo, useState } from "react";
import type { Transaction } from "../types/transaction";
import {
  createReview,
  deleteReview,
  getEventReviews,
  type Review,
} from "../services/review.service";

interface TransactionCardProps {
  transaction: Transaction;
  onUploadProof: (transactionId: string, paymentProofUrl: string) => Promise<void>;
}

const TransactionCard = ({
  transaction,
  onUploadProof,
}: TransactionCardProps) => {
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const statusClass =
    transaction.status === "DONE"
      ? "done"
      : transaction.status === "REJECTED"
      ? "rejected"
      : "waiting";

  const eventEndDate = transaction.event?.endDate
    ? new Date(transaction.event.endDate)
    : null;

  const hasEventFinished = eventEndDate ? eventEndDate < new Date() : false;
  const isDone = transaction.status === "DONE";
  const canReview = isDone && hasEventFinished;

  const userReview = useMemo(() => {
    return reviews.find(
      (review) => review.userId === user?.id || review.user?.id === user?.id
    );
  }, [reviews, user?.id]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;

    return (
      reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
      reviews.length
    );
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      if (!transaction.eventId) return;

      const data = await getEventReviews(transaction.eventId);
      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH REVIEWS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [transaction.eventId]);

  const handleUpload = async () => {
    if (!paymentProofUrl.trim()) {
      alert("Payment proof URL is required");
      return;
    }

    await onUploadProof(transaction.id, paymentProofUrl.trim());
    setPaymentProofUrl("");
  };

  const handleSubmitReview = async () => {
    try {
      if (!canReview) {
        setReviewError("Review can only be submitted after the event is finished and transaction is DONE.");
        return;
      }

      if (!reviewComment.trim()) {
        setReviewError("Please write your review comment.");
        return;
      }

      setReviewLoading(true);
      setReviewError("");
      setReviewSuccess("");

      await createReview({
        eventId: transaction.eventId,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReviewSuccess("Review submitted successfully.");
      setReviewComment("");
      setReviewRating(5);

      await fetchReviews();
    } catch (err: any) {
      console.error("CREATE REVIEW ERROR:", err);
      setReviewError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to submit review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await deleteReview(reviewId);
      await fetchReviews();
    } catch (err: any) {
      console.error("DELETE REVIEW ERROR:", err);
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to delete review"
      );
    }
  };

  return (
    <div className="premium-record-card">
      <div className="premium-record-top">
        <div>
          <h3 className="premium-record-title">{transaction.event?.name}</h3>
          <p className="premium-record-subtitle">
            Track your payment progress and purchased tickets here.
          </p>

          <div className="transaction-rating-mini">
            <span>★ {averageRating.toFixed(1)}</span>
            <small>{reviews.length} reviews</small>
          </div>
        </div>

        <div className="premium-record-status-wrap">
          <span className={`status ${statusClass}`}>{transaction.status}</span>
        </div>
      </div>

      <div className="premium-record-body">
        <div className="premium-info-grid">
          <div className="premium-info-box">
            <span>Total Amount</span>
            <strong>IDR {transaction.totalAmount?.toLocaleString("id-ID")}</strong>
          </div>

          <div className="premium-info-box">
            <span>Points Used</span>
            <strong>
              - IDR {Number(transaction.pointsUsed || 0).toLocaleString("id-ID")}
            </strong>
          </div>

          <div className="premium-info-box">
            <span>Final Amount</span>
            <strong>IDR {transaction.finalAmount.toLocaleString("id-ID")}</strong>
          </div>

          <div className="premium-info-box">
            <span>Created At</span>
            <strong>{new Date(transaction.createdAt).toLocaleString()}</strong>
          </div>
        </div>

        <div className="premium-items-box">
          <h4>Purchased Tickets</h4>
          {transaction.items.map((item) => (
            <div className="premium-item-row" key={item.id}>
              <span>{item.ticketType?.name}</span>
              <strong>
                Qty {item.quantity} • IDR {item.subtotal.toLocaleString("id-ID")}
              </strong>
            </div>
          ))}
        </div>

        {transaction.paymentProofUrl && (
          <div className="premium-proof-box">
            Payment proof uploaded:{" "}
            <a href={transaction.paymentProofUrl} target="_blank" rel="noreferrer">
              View Proof
            </a>
          </div>
        )}

        {transaction.status === "WAITING_PAYMENT" && (
          <div className="premium-proof-upload-box">
            <label>Payment Proof URL</label>
            <input
              type="text"
              value={paymentProofUrl}
              onChange={(e) => setPaymentProofUrl(e.target.value)}
              placeholder="Paste payment proof URL"
            />

            <button type="button" onClick={handleUpload}>
              Upload Payment Proof
            </button>
          </div>
        )}

        {transaction.status === "REJECTED" && transaction.rejectionReason && (
          <div className="premium-reason-box">
            Rejection Reason: {transaction.rejectionReason}
          </div>
        )}

        <div className="transaction-review-box">
          <div className="section-heading">
            <div>
              <p className="section-kicker">REVIEW</p>
              <h3>Review this event</h3>
            </div>
          </div>

          {!isDone && (
            <div className="dashboard-soft-warning">
              Review will be available after your transaction status becomes DONE.
            </div>
          )}

          {isDone && !hasEventFinished && (
            <div className="dashboard-soft-warning">
              Review will be available after the event has finished.
            </div>
          )}

          {canReview && userReview && (
            <div className="review-item">
              <div className="review-avatar">
                {(user?.profile?.fullName || user?.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="review-content">
                <div className="review-top">
                  <div>
                    <h4>Your Review</h4>
                    <p className="muted">
                      {userReview.createdAt
                        ? new Date(userReview.createdAt).toLocaleString()
                        : "Recently"}
                    </p>
                  </div>

                  <div className="review-stars">
                    {"★".repeat(userReview.rating)}
                    {"☆".repeat(5 - userReview.rating)}
                  </div>
                </div>

                <p>{userReview.comment}</p>

                <button
                  type="button"
                  className="button-secondary danger-soft-btn"
                  style={{ marginTop: 12 }}
                  onClick={() => handleDeleteReview(userReview.id)}
                >
                  Delete Review
                </button>
              </div>
            </div>
          )}

          {canReview && !userReview && (
            <div className="review-form-box transaction-review-form">
              <p className="muted">
                Share your rating and experience after attending this event.
              </p>

              <div className="rating-picker">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= reviewRating ? "star-btn active" : "star-btn"}
                    onClick={() => setReviewRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="premium-input-group">
                <label>Comment</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => {
                    setReviewComment(e.target.value);
                    setReviewError("");
                    setReviewSuccess("");
                  }}
                  placeholder="Tell others about your experience..."
                  rows={4}
                />
              </div>

              {reviewError && (
                <div className="error-box" style={{ marginTop: 12 }}>
                  {reviewError}
                </div>
              )}

              {reviewSuccess && (
                <div className="success-box" style={{ marginTop: 12 }}>
                  {reviewSuccess}
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={reviewLoading}
                style={{ marginTop: 14 }}
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;