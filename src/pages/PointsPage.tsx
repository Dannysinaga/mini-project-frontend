import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPointsBalance, getPointsHistory } from "../services/points.service";

type PointHistoryItem = {
  id?: string;
  amount?: number;
  type?: string;
  source?: string;
  referenceType?: string;
  referenceId?: string;
  expiresAt?: string | null;
  createdAt?: string;
};

const fallbackBalance = {
  points: 125000,
};

const fallbackHistory: PointHistoryItem[] = [
  {
    id: "1",
    amount: 10000,
    type: "CREDIT",
    source: "REFERRAL_REWARD",
    referenceType: "REFERRAL_USAGE",
    createdAt: "2026-05-01T10:00:00.000Z",
    expiresAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "2",
    amount: 25000,
    type: "CREDIT",
    source: "EVENT_PURCHASE",
    referenceType: "TRANSACTION",
    createdAt: "2026-05-06T10:00:00.000Z",
    expiresAt: "2026-09-06T10:00:00.000Z",
  },
  {
    id: "3",
    amount: 5000,
    type: "DEBIT",
    source: "POINT_REDEMPTION",
    referenceType: "TRANSACTION",
    createdAt: "2026-05-12T10:00:00.000Z",
    expiresAt: null,
  },
];

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PointsPage = () => {
  const [balance, setBalance] = useState<number>(fallbackBalance.points);
  const [history, setHistory] = useState<PointHistoryItem[]>(fallbackHistory);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  const creditedPoints = useMemo(() => {
    return history
      .filter((item) => item.type === "CREDIT")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [history]);

  const debitedPoints = useMemo(() => {
    return history
      .filter((item) => item.type === "DEBIT")
      .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [history]);

  const loadPointsData = async () => {
    try {
      setLoading(true);
      setPreviewMode(false);

      const [balanceRes, historyRes] = await Promise.all([
        getPointsBalance(),
        getPointsHistory(),
      ]);

      const resolvedBalance =
        balanceRes?.points ??
        balanceRes?.balance ??
        balanceRes?.totalPoints ??
        fallbackBalance.points;

      const resolvedHistory = Array.isArray(historyRes)
        ? historyRes
        : historyRes?.data || historyRes?.history || fallbackHistory;

      setBalance(Number(resolvedBalance || 0));
      setHistory(resolvedHistory);
    } catch (err) {
      console.error(err);
      setPreviewMode(true);
      setBalance(fallbackBalance.points);
      setHistory(fallbackHistory);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPointsData();
  }, []);

  return (
    <div className="page-container">
      <Navbar />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 40 }}>
        <div className="organizer-hero">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "white",
            }}
          >
            MY POINTS
          </span>
          <h1>Track your rewards and point activity</h1>
          <p>
            Monitor your points balance, review reward history, and keep track
            of credits and redemptions in one premium view.
          </p>
        </div>

        {previewMode && (
          <div className="dashboard-soft-warning">
            Live points data is temporarily unavailable. Preview mode is shown.
          </div>
        )}

        {loading ? (
          <div className="premium-card" style={{ marginTop: 24 }}>
            <p className="muted" style={{ margin: 0 }}>
              Loading points...
            </p>
          </div>
        ) : (
          <>
            <div className="dashboard-stats-grid">
              <div className="dashboard-stat-card points-highlight-card">
                <p>Available Points</p>
                <h2>{balance.toLocaleString("id-ID")}</h2>
              </div>

              <div className="dashboard-stat-card">
                <p>Total Credit</p>
                <h2>{creditedPoints.toLocaleString("id-ID")}</h2>
              </div>

              <div className="dashboard-stat-card">
                <p>Total Debit</p>
                <h2>{debitedPoints.toLocaleString("id-ID")}</h2>
              </div>

              <div className="dashboard-stat-card">
                <p>Total Records</p>
                <h2>{history.length}</h2>
              </div>
            </div>

            <div className="premium-card" style={{ marginTop: 24 }}>
              <div className="section-heading">
                <div>
                  <p className="section-kicker">POINTS HISTORY</p>
                  <h2>Recent Activity</h2>
                </div>
              </div>

              {history.length > 0 ? (
                <div className="points-history-list">
                  {history.map((item, index) => {
                    const isCredit = item.type === "CREDIT";

                    return (
                      <div className="points-history-item" key={item.id || index}>
                        <div className="points-history-left">
                          <div
                            className={
                              isCredit
                                ? "points-icon-box credit"
                                : "points-icon-box debit"
                            }
                          >
                            {isCredit ? "+" : "-"}
                          </div>

                          <div>
                            <h3>{item.source || "POINT ACTIVITY"}</h3>
                            <p className="muted">
                              {item.referenceType || "REFERENCE"} •{" "}
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="points-history-right">
                          <strong
                            className={
                              isCredit ? "points-amount credit" : "points-amount debit"
                            }
                          >
                            {isCredit ? "+" : "-"}
                            {Number(item.amount || 0).toLocaleString("id-ID")}
                          </strong>
                          <span className="muted small">
                            Exp: {formatDate(item.expiresAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="muted" style={{ margin: 0 }}>
                  No point history available yet.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default PointsPage;