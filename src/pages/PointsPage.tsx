import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getPointsBalance, getPointsHistory } from "../services/points.service";
import { getMyCoupons, type Coupon } from "../services/coupon.service";

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
  points: 0,
};

const fallbackHistory: PointHistoryItem[] = [];
const fallbackCoupons: Coupon[] = [];

const formatDate = (value?: string | null) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const formatIDR = (value?: number) => {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
};

const PointsPage = () => {
  const [balance, setBalance] = useState<number>(fallbackBalance.points);
  const [history, setHistory] = useState<PointHistoryItem[]>(fallbackHistory);
  const [coupons, setCoupons] = useState<Coupon[]>(fallbackCoupons);

  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

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

  const activeCoupons = useMemo(() => {
    return coupons.filter((coupon) => !coupon.isUsed && !coupon.usedAt);
  }, [coupons]);

  const usedCoupons = useMemo(() => {
    return coupons.filter((coupon) => coupon.isUsed || coupon.usedAt);
  }, [coupons]);

  const loadRewardsData = async () => {
    try {
      setLoading(true);
      setPreviewMode(false);

      const [balanceRes, historyRes, couponsRes] = await Promise.all([
        getPointsBalance(),
        getPointsHistory(),
        getMyCoupons(),
      ]);

      const resolvedBalance =
        balanceRes?.points ??
        balanceRes?.balance ??
        balanceRes?.totalPoints ??
        fallbackBalance.points;

      const resolvedHistory = Array.isArray(historyRes)
        ? historyRes
        : historyRes?.data || historyRes?.history || fallbackHistory;

      const resolvedCoupons = Array.isArray(couponsRes)
        ? couponsRes
        : fallbackCoupons;

      setBalance(Number(resolvedBalance || 0));
      setHistory(resolvedHistory);
      setCoupons(resolvedCoupons);
    } catch (err) {
      console.error(err);
      setPreviewMode(true);
      setBalance(fallbackBalance.points);
      setHistory(fallbackHistory);
      setCoupons(fallbackCoupons);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRewardsData();
  }, []);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyMessage(`Coupon ${code} copied`);
      setTimeout(() => setCopyMessage(""), 1800);
    } catch (err) {
      console.error(err);
      setCopyMessage("Failed to copy coupon code");
      setTimeout(() => setCopyMessage(""), 1800);
    }
  };

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
            MY REWARDS
          </span>
          <h1>Track your points and coupons</h1>
          <p>
            Monitor your points balance, coupon rewards, and reward activity in
            one clean premium view.
          </p>
        </div>

        {previewMode && (
          <div className="dashboard-soft-warning">
            Live rewards data is temporarily unavailable. Preview mode is shown.
          </div>
        )}

        {copyMessage && (
          <div className="success-box" style={{ marginTop: 20 }}>
            {copyMessage}
          </div>
        )}

        {loading ? (
          <div className="premium-card" style={{ marginTop: 24 }}>
            <p className="muted" style={{ margin: 0 }}>
              Loading rewards...
            </p>
          </div>
        ) : (
          <>
            <div className="rewards-section-card points-rewards-card">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">POINTS SECTION</p>
                  <h2>Moneybag Points</h2>
                </div>
              </div>

              <div className="dashboard-stats-grid">
                <div className="dashboard-stat-card points-highlight-card">
                  <p>Available Points</p>
                  <h2>{balance.toLocaleString("id-ID")}</h2>
                </div>

                <div className="dashboard-stat-card">
                  <p>Total Credits</p>
                  <h2>{creditedPoints.toLocaleString("id-ID")}</h2>
                </div>

                <div className="dashboard-stat-card">
                  <p>Total Debits</p>
                  <h2>{debitedPoints.toLocaleString("id-ID")}</h2>
                </div>

                <div className="dashboard-stat-card">
                  <p>Records</p>
                  <h2>{history.length}</h2>
                </div>
              </div>

              <div className="premium-card rewards-inner-card">
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
                        <div
                          className="points-history-item"
                          key={item.id || index}
                        >
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
                                isCredit
                                  ? "points-amount credit"
                                  : "points-amount debit"
                              }
                            >
                              {isCredit ? "+" : "-"}
                              {Number(item.amount || 0).toLocaleString(
                                "id-ID"
                              )}
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
            </div>

            <div className="rewards-section-card coupons-rewards-card">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">COUPONS SECTION</p>
                  <h2>Tickets Coupons</h2>
                </div>

                <div className="coupon-summary-pill">
                  {activeCoupons.length} Active
                </div>
              </div>

              {coupons.length > 0 ? (
                <div className="coupon-rewards-grid">
                  {coupons.map((coupon) => {
                    const isUsed = Boolean(coupon.isUsed || coupon.usedAt);
                    const discount = coupon.discountAmount ?? 0;
                    const validUntil = coupon.validUntil;

                    return (
                      <div
                        className={
                          isUsed
                            ? "coupon-reward-card used"
                            : "coupon-reward-card"
                        }
                        key={coupon.id}
                      >
                        <div className="coupon-reward-top">
                          <div>
                            <p className="section-kicker">COUPON CODE</p>
                            <h3>{coupon.code}</h3>
                          </div>

                          <span
                            className={
                              isUsed ? "coupon-status used" : "coupon-status"
                            }
                          >
                            {isUsed ? "Sudah digunakan" : "Belum digunakan"}
                          </span>
                        </div>

                        <div className="coupon-reward-info">
                          <div>
                            <span>Diskon</span>
                            <strong>{formatIDR(discount)}</strong>
                          </div>

                          <div>
                            <span>Berlaku hingga</span>
                            <strong>{formatDate(validUntil)}</strong>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="coupon-copy-btn"
                          disabled={isUsed}
                          onClick={() => handleCopyCode(coupon.code)}
                        >
                          {isUsed ? "Coupon Used" : "Salin Kode"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="premium-card transaction-empty-state">
                  <h2>No coupons yet</h2>
                  <p className="muted">
                    Welcome coupons and referral coupons will appear here.
                  </p>
                </div>
              )}

              {usedCoupons.length > 0 && (
                <p className="muted coupon-note">
                  You have {usedCoupons.length} used coupon
                  {usedCoupons.length > 1 ? "s" : ""}.
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