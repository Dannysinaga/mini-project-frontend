import { useEffect, useState } from "react";
import PendingTransactionCard from "../components/PendingTransactionCard";
import {
  approveTransaction,
  getPendingTransactions,
  rejectTransaction,
} from "../services/transaction.service";
import type { Transaction } from "../types/transaction";
import Navbar from "../components/Navbar";

const OrganizerPendingTransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchPendingTransactions = async () => {
    try {
      if (!user?.id) {
        setError("You must login first");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      const data = await getPendingTransactions(user.id);
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingTransactions();
  }, []);

  const handleApprove = async (transactionId: string) => {
    try {
      await approveTransaction(transactionId);
      alert("Transaction approved successfully");
      fetchPendingTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to approve transaction");
    }
  };

  const handleReject = async (transactionId: string) => {
    try {
      const reason = prompt("Enter rejection reason") || "Payment rejected";
      await rejectTransaction(transactionId, reason);
      alert("Transaction rejected successfully");
      fetchPendingTransactions();
    } catch (err) {
      console.error(err);
      alert("Failed to reject transaction");
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <h1 className="section-title">Pending Transactions</h1>

      {loading && <p>Loading pending transactions...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && transactions.length === 0 && (
        <p>No pending transactions found</p>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {transactions.map((transaction) => (
            <PendingTransactionCard
              key={transaction.id}
              transaction={transaction}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrganizerPendingTransactionsPage;