import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "././pages/users/Home.jsx";
import Services from "./pages/users/Services.jsx";
import About from "./pages/users/About.jsx";
import Contact from "./pages/users/Contact.jsx";
import Login from "./pages/users/Login.jsx";
import Layout from "./layouts/user/Layout.jsx";
import AdminLayout from "./layouts/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import Assessments from "./pages/admin/Assessments.jsx";
import Users from "./pages/admin/Users.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import Settings from "./pages/admin/Settings.jsx";
import Notifications from "./pages/admin/Notifications.jsx";
import Profile from "./pages/admin/Profile.jsx";

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="assessments" element={<Assessments />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
