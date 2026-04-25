import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventDetailPage from "./pages/EventDetailPage";
import TransactionHistoryPage from "./pages/TransactionHistorypage";
import OrganizerPendingTransactionsPage from "./pages/OrganizerPendingTransactionsPage";
import OrganizerCreateEventPage from "./pages/OrganizerCreateEventPage";
import OrganizerManageEventsPage from "./pages/OrganizerManageEventsPage";
import OrganizerEditEventPage from "./pages/OrganizerEditEventPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import PointsPage from "./pages/PointsPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/points" element={<PointsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/transactions" element={<TransactionHistoryPage />} />
      <Route
        path="/organizer/dashboard"
        element={<OrganizerDashboardPage />}
      />
      <Route
        path="/organizer/pending-transactions"
        element={<OrganizerPendingTransactionsPage />}
      />
      <Route
        path="/organizer/create-event"
        element={<OrganizerCreateEventPage />}
      />
      <Route
        path="/organizer/manage-events"
        element={<OrganizerManageEventsPage />}
      />
      <Route
        path="/organizer/edit-event/:id"
        element={<OrganizerEditEventPage />}
      />
    </Routes>
  );
}

export default App;