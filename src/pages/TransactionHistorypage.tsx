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
      

      <h1 className="section-title">Transaction History</h1>

      {loading && <p>Loading transactions...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && transactions.length === 0 && (
        <p>No transactions found</p>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onUploadProof={handleUploadProof}
            />
          ))}
          <Footer/>
        </div>
      )}
    </div>
  );
};

export default TransactionHistoryPage;