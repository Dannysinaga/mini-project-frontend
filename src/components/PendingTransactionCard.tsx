import { useState } from "react";
import type { Transaction } from "../types/transaction";

interface PendingTransactionCardProps {
  transaction: Transaction;
  onApprove: (transactionId: string) => Promise<void>;
  onReject: (transactionId: string, rejectionReason: string) => Promise<void>;
}

const PendingTransactionCard = ({
  transaction,
  onApprove,
  onReject,
}: PendingTransactionCardProps) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      alert("Rejection reason is required");
      return;
    }

    await onReject(transaction.id, rejectionReason);
    setShowRejectForm(false);
    setRejectionReason("");
  };

  return (
    <div className="premium-record-card">
      <div className="premium-record-top">
        <div>
          <h3 className="premium-record-title">{transaction.event?.name}</h3>
          <p className="premium-record-subtitle">
            Review customer payment and validate the submitted transaction.
          </p>
        </div>

        <div className="premium-record-status-wrap">
          <span className="status waiting">{transaction.status}</span>
        </div>
      </div>

      <div className="premium-record-body">
        <div className="premium-info-grid">
          <div className="premium-info-box">
            <span>Customer</span>
            <strong>
              {transaction.user?.profile?.fullName || transaction.user?.email}
            </strong>
          </div>

          <div className="premium-info-box">
            <span>Total Payment</span>
            <strong>IDR {transaction.finalAmount.toLocaleString()}</strong>
          </div>

          <div className="premium-info-box">
            <span>Status</span>
            <strong>{transaction.status}</strong>
          </div>
        </div>

        <div className="premium-items-box">
          <h4>Ticket Summary</h4>
          {transaction.items.map((item) => (
            <div className="premium-item-row" key={item.id}>
              <span>{item.ticketType?.name}</span>
              <strong>Qty {item.quantity}</strong>
            </div>
          ))}
        </div>

        {transaction.paymentProofUrl && (
          <div className="premium-proof-box">
            Payment proof available:{" "}
            <a href={transaction.paymentProofUrl} target="_blank" rel="noreferrer">
              View Proof
            </a>
          </div>
        )}

        <div className="premium-card-actions">
          <button
            className="premium-action-approve"
            onClick={() => onApprove(transaction.id)}
          >
            Approve
          </button>

          <button
            className="premium-action-reject"
            onClick={() => setShowRejectForm((prev) => !prev)}
          >
            {showRejectForm ? "Cancel" : "Reject"}
          </button>
        </div>

        {showRejectForm && (
          <div className="reject-form">
            <textarea
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <button onClick={handleRejectSubmit}>Submit Reject</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingTransactionCard;