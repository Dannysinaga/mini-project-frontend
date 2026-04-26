import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getOrganizerEvents } from "../services/event.service";
import {
  createVoucher,
  getEventVouchers,
  type Voucher,
} from "../services/voucher.service";
import type { Event } from "../types/event";

const OrganizerVoucherPage = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);

  const [code, setCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(20000);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quota, setQuota] = useState(100);

  const [loading, setLoading] = useState(true);
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEvents = async () => {
    try {
      if (!user?.id) {
        setError("You must login first");
        return;
      }

      setLoading(true);
      const data = await getOrganizerEvents(user.id);
      setEvents(data);

      if (data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load events"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadVouchers = async (eventId: string) => {
    try {
      if (!eventId) return;

      setVoucherLoading(true);
      const data = await getEventVouchers(eventId);
      setVouchers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setVouchers([]);
    } finally {
      setVoucherLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadVouchers(selectedEventId);
    }
  }, [selectedEventId]);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!user?.id) {
    setError("You must login first");
    return;
  }

  if (!selectedEventId) {
    setError("Please select an event");
    return;
  }

  if (!code.trim()) {
    setError("Voucher code is required");
    return;
  }

  if (!discountAmount || Number(discountAmount) <= 0) {
    setError("Discount amount must be greater than 0");
    return;
  }

  if (!startDate || !endDate) {
    setError("Start date and end date are required");
    return;
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (parsedEndDate <= parsedStartDate) {
    setError("End date must be after start date");
    return;
  }

  if (!quota || Number(quota) <= 0) {
    setError("Quota must be greater than 0");
    return;
  }

  try {
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      organizerId: user.id,
      eventId: selectedEventId,
      code: code.trim().toUpperCase(),
      discountAmount: Number(discountAmount),
      startDate: parsedStartDate.toISOString(),
      endDate: parsedEndDate.toISOString(),
      quota: Number(quota),
    };

    console.log("CREATE VOUCHER PAYLOAD:", payload);

    await createVoucher(payload);

    setSuccess("Voucher created successfully");
    setCode("");
    setDiscountAmount(20000);
    setStartDate("");
    setEndDate("");
    setQuota(100);

    await loadVouchers(selectedEventId);
  } catch (err: any) {
    console.error("CREATE VOUCHER ERROR:", err);
    console.error("BACKEND RESPONSE:", err?.response?.data);

    setError(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to create voucher"
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="page-container">
      <Navbar />

      <div className="container" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <div className="organizer-hero">
          <span
            className="badge"
            style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
          >
            ORGANIZER VOUCHER
          </span>
          <h1>Create and manage event vouchers</h1>
          <p>
            Create limited-time voucher promotions for your events and monitor
            voucher usage.
          </p>
        </div>

        {loading ? (
          <div className="premium-card" style={{ marginTop: 24 }}>
            <p className="muted" style={{ margin: 0 }}>
              Loading voucher page...
            </p>
          </div>
        ) : (
          <div className="voucher-page-grid">
            <div className="premium-card voucher-form-card">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">CREATE VOUCHER</p>
                  <h2>Buat Voucher Baru</h2>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="premium-input-group">
                  <label>Pilih Event</label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                  >
                    <option value="">Choose event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="premium-input-group">
                  <label>Kode Voucher</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: DISKON20"
                  />
                </div>

                <div className="premium-input-group">
                  <label>Diskon</label>
                  <input
                    type="number"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    placeholder="Contoh: 20000"
                  />
                </div>

                <div className="voucher-date-grid">
                  <div className="premium-input-group">
                    <label>Mulai Berlaku</label>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div className="premium-input-group">
                    <label>Sampai</label>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="premium-input-group">
                  <label>Kuota</label>
                  <input
                    type="number"
                    min={1}
                    value={quota}
                    onChange={(e) => setQuota(Number(e.target.value))}
                    placeholder="Contoh: 100"
                  />
                </div>

                {error && (
                  <div className="error-box" style={{ marginTop: 14 }}>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="success-box" style={{ marginTop: 14 }}>
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  style={{ marginTop: 18, width: "100%" }}
                >
                  {submitting ? "Creating..." : "Buat Voucher"}
                </button>
              </form>
            </div>

            <div className="premium-card voucher-list-card">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">MY VOUCHERS</p>
                  <h2>Voucher Saya</h2>
                </div>
              </div>

              {voucherLoading ? (
                <p className="muted">Loading vouchers...</p>
              ) : vouchers.length === 0 ? (
                <div className="voucher-empty-box">
                  <h3>No vouchers yet</h3>
                  <p className="muted">
                    Voucher yang kamu buat untuk event ini akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="organizer-voucher-list">
                  {vouchers.map((voucher) => {
                    const used = voucher.usedQuota || 0;
                    const quotaValue = voucher.quota || 0;
                    const isActive = voucher.isActive ?? true;

                    return (
                      <div className="organizer-voucher-card" key={voucher.id}>
                        <div className="organizer-voucher-top">
                          <div>
                            <p className="section-kicker">KODE</p>
                            <h3>{voucher.code}</h3>
                          </div>

                          <span
                            className={
                              isActive
                                ? "voucher-status active"
                                : "voucher-status inactive"
                            }
                          >
                            {isActive ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </div>

                        <div className="organizer-voucher-info">
                          <div>
                            <span>Diskon</span>
                            <strong>
                              Rp{" "}
                              {Number(voucher.discountAmount || 0).toLocaleString(
                                "id-ID"
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>Berlaku</span>
                            <strong>
                              {new Date(voucher.startDate).toLocaleDateString(
                                "id-ID"
                              )}{" "}
                              -{" "}
                              {new Date(voucher.endDate).toLocaleDateString(
                                "id-ID"
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>Terpakai</span>
                            <strong>
                              {used} / {quotaValue || "-"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrganizerVoucherPage;