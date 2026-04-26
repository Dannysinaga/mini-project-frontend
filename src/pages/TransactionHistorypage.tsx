import { useEffect, useState } from "react";
import TransactionCard from "../components/TransactionCard";
import {
  getTransactionHistory,
  uploadPaymentProof,
} from "../services/transaction.service";
import type { Transaction } from "../types/transaction";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchTransactions = async () => {
    try {
      if (!user?.id) {
        setError("You must login first");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      const data = await getTransactionHistory(user.id);
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleUploadProof = async (
    transactionId: string,
    paymentProofUrl: string
  ) => {
    try {
      if (!paymentProofUrl) {
        alert("Payment proof URL is required");
        return;
      }

      await uploadPaymentProof(transactionId, paymentProofUrl);
      alert("Payment proof uploaded successfully");
      fetchTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to upload payment proof");
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="container" style={{ paddingTop: 28, paddingBottom: 40 }}>
        <div className="organizer-hero">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "white",
            }}
          >
            MY TRANSACTIONS
          </span>
          <h1>Track your orders and payment progress</h1>
          <p>
            Review your purchased tickets, monitor payment status, and upload
            proof of payment before the deadline.
          </p>
        </div>

        {loading && (
          <div className="premium-card" style={{ marginTop: 24 }}>
            <p className="muted" style={{ margin: 0 }}>
              Loading transactions...
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="error-box" style={{ marginTop: 24 }}>
            {error}
          </div>
        )}

        {!loading && !error && transactions.length === 0 && (
          <div className="premium-card transaction-empty-state" style={{ marginTop: 24 }}>
            <h2>No transactions yet</h2>
            <p className="muted">
              Your ticket purchases will appear here after you complete a
              checkout.
            </p>
          </div>
        )}

        {!loading && !error && transactions.length > 0 && (
          <div
            className="transaction-history-list"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              marginTop: 24,
            }}
          >
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onUploadProof={handleUploadProof}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TransactionHistoryPage;