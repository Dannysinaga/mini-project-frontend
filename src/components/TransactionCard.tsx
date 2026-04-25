import type { Transaction } from "../types/transaction";

interface TransactionCardProps {
  transaction: Transaction;
  onUploadProof: (transactionId: string, paymentProofUrl: string) => Promise<void>;
}

const TransactionCard = ({
  transaction,
  onUploadProof,
}: TransactionCardProps) => {
  const handleUpload = () => {
    const proofUrl = prompt("Enter payment proof URL");
    if (!proofUrl) return;
    onUploadProof(transaction.id, proofUrl);
  };

  const statusClass =
    transaction.status === "DONE"
      ? "done"
      : transaction.status === "REJECTED"
      ? "rejected"
      : "waiting";

  return (
    <div className="premium-record-card">
      <div className="premium-record-top">
        <div>
          <h3 className="premium-record-title">{transaction.event?.name}</h3>
          <p className="premium-record-subtitle">
            Track your payment progress and purchased tickets here.
          </p>
        </div>

        <div className="premium-record-status-wrap">
          <span className={`status ${statusClass}`}>{transaction.status}</span>
        </div>
      </div>

      <div className="premium-record-body">
        <div className="premium-info-grid">
          <div className="premium-info-box">
            <span>Total Amount</span>
            <strong>IDR {transaction.finalAmount.toLocaleString()}</strong>
          </div>

          <div className="premium-info-box">
            <span>Created At</span>
            <strong>{new Date(transaction.createdAt).toLocaleString()}</strong>
          </div>

          <div className="premium-info-box">
            <span>Payment Status</span>
            <strong>{transaction.status}</strong>
          </div>
        </div>

        <div className="premium-items-box">
          <h4>Purchased Tickets</h4>
          {transaction.items.map((item) => (
            <div className="premium-item-row" key={item.id}>
              <span>{item.ticketType?.name}</span>
              <strong>Qty {item.quantity}</strong>
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

        {transaction.status === "REJECTED" && transaction.rejectionReason && (
          <div className="premium-reason-box">
            Rejection Reason: {transaction.rejectionReason}
          </div>
        )}

        {transaction.status === "WAITING_PAYMENT" && (
          <div className="premium-card-actions">
            <button onClick={() => handleUpload()}>Upload Payment Proof</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;