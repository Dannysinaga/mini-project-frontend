import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../services/user.service";

const ProfilePage = () => {
  const storedUser = localStorage.getItem("user");
  const localUser = storedUser ? JSON.parse(storedUser) : null;

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState(localUser?.email || "");
  const [role, setRole] = useState(localUser?.role || "");
  const [points, setPoints] = useState<number>(localUser?.points || 0);
  const [referralCode, setReferralCode] = useState(
    localUser?.referralCode || ""
  );

  const [fullName, setFullName] = useState(
    localUser?.profile?.fullName || localUser?.fullname || ""
  );
  const [phone, setPhone] = useState(localUser?.profile?.phone || "");
  const [photoUrl, setPhotoUrl] = useState(localUser?.profile?.photoUrl || "");
  const [bio, setBio] = useState(localUser?.profile?.bio || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      setError("");

      const data = await getProfile();

      setEmail(data.email || localUser?.email || "");
      setRole(data.role || localUser?.role || "");
      setPoints(data.points || localUser?.points || 0);
      setReferralCode(data.referralCode || localUser?.referralCode || "");

      setFullName(
        data.profile?.fullName ||
          localUser?.profile?.fullName ||
          localUser?.fullname ||
          ""
      );
      setPhone(data.profile?.phone || localUser?.profile?.phone || "");
      setPhotoUrl(data.profile?.photoUrl || localUser?.profile?.photoUrl || "");
      setBio(data.profile?.bio || localUser?.profile?.bio || "");

      const mergedUser = {
        ...(localUser || {}),
        email: data.email || localUser?.email || "",
        role: data.role || localUser?.role || "",
        points: data.points || localUser?.points || 0,
        referralCode: data.referralCode || localUser?.referralCode || "",
        profile: {
          ...(localUser?.profile || {}),
          ...(data.profile || {}),
        },
      };

      localStorage.setItem("user", JSON.stringify(mergedUser));
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to load profile"
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSavingProfile(true);
      setError("");
      setSuccess("");

      const response = await updateProfile({
        fullName,
        phone,
        photoUrl,
        bio,
      });

      const updatedUser = {
        ...(localUser || {}),
        email,
        role,
        points,
        referralCode,
        profile: {
          ...(localUser?.profile || {}),
          fullName,
          phone,
          photoUrl,
          bio,
        },
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess(response?.message || "Profile updated successfully");
      fetchProfile();
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New password confirmation does not match");
      return;
    }

    try {
      setSavingPassword(true);
      setError("");
      setSuccess("");

      const response = await changePassword({
        currentPassword,
        newPassword,
      });

      setSuccess(response?.message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        <div className="organizer-hero">
          <span
            className="badge"
            style={{
              background: "rgba(255,255,255,0.18)",
              color: "white",
            }}
          >
            MY PROFILE
          </span>
          <h1>Manage your personal account</h1>
          <p>
            Update your profile information, review your account details, and
            keep your password secure in one place.
          </p>
        </div>

        {loadingProfile ? (
          <div className="premium-card" style={{ marginTop: 24 }}>
            <p className="muted" style={{ margin: 0 }}>
              Loading profile...
            </p>
          </div>
        ) : (
          <div className="profile-grid">
            <div className="premium-card">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">ACCOUNT INFO</p>
                  <h2>Profile Overview</h2>
                </div>
              </div>

              <div className="profile-overview">
                <div className="profile-avatar-box">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="profile-avatar-image"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {fullName ? fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>

                <div className="profile-meta">
                  <h3>{fullName || "Unnamed User"}</h3>
                  <p className="muted">{email || "-"}</p>

                  <div className="profile-badges">
                    <span className="soft-badge">{role || "USER"}</span>
                    <span className="soft-badge">Points: {points}</span>
                  </div>

                  <div className="profile-info-list">
                    <p>
                      <strong>Referral Code:</strong> {referralCode || "-"}
                    </p>
                    <p>
                      <strong>Phone:</strong> {phone || "-"}
                    </p>
                    <p>
                      <strong>Bio:</strong> {bio || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="premium-card">
              <div className="section-heading">
                <div>
                  <p className="section-kicker">EDIT PROFILE</p>
                  <h2>Update Information</h2>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="premium-login-form">
                <div className="premium-input-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="premium-input-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    placeholder="Enter phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="premium-input-group">
                  <label>Photo URL</label>
                  <input
                    type="text"
                    placeholder="Enter photo URL"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>

                <div className="premium-input-group">
                  <label>Bio</label>
                  <textarea
                    placeholder="Write short bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>

                {error && <div className="error-box">{error}</div>}
                {success && <div className="success-box">{success}</div>}

                <button type="submit" disabled={savingProfile}>
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="premium-card" style={{ marginTop: 24 }}>
          <div className="section-heading">
            <div>
              <p className="section-kicker">SECURITY</p>
              <h2>Change Password</h2>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="premium-login-form">
            <div className="premium-input-group">
              <label>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="premium-input-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="premium-input-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <div className="error-box">{error}</div>}
            {success && <div className="success-box">{success}</div>}

            <button type="submit" disabled={savingPassword}>
              {savingPassword ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;