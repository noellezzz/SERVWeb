import "./App.css";
import { Routes, Route } from "react-router-dom";

// Layouts
import Layout from "./layouts/user/Layout";
import AdminLayout from "./layouts/admin/AdminLayout";

// USER PAGES
import Home from "././pages/users/Home";
import Evaluation from "./pages/users/Evaluation";
import Services from "./pages/users/Services";
import About from "./pages/users/About";
import Contact from "./pages/users/Contact";

// ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import AssessmenstPage from "./pages/admin/Assessments";
import Users from "./pages/admin/Users";
import ReportsPage from "./pages/admin/Reports";
import FeedbacksPage from "./pages/admin/Feedbacks";
import Analytics from "./pages/admin/Analytics";
import Settings from "./pages/admin/Settings";
import Notifications from "./pages/admin/Notifications";
import Profile from "./pages/admin/Profile";

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="evaluation" element={<Evaluation />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="users" element={<Users />} />
        <Route path="assessments" element={<AssessmenstPage />} />
        <Route path="feedbacks" element={<FeedbacksPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />


        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
