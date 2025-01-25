import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom"; // Import Link
import Gradient from "../../components/Gradient";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { IoPersonSharp } from "react-icons/io5";
import ReportIcon from "@mui/icons-material/Description";
import logo from "../../assets/logo.png";
import { Card, CardContent } from "@mui/material";
import AdminHeader from "./AdminHeader";

const NAVIGATION = [
  { segment: "", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "assessments", title: "Assessments", icon: <NoteAltIcon /> },
  { segment: "users", title: "Users", icon: <IoPersonSharp /> },
  { segment: "reports", title: "Reports", icon: <ReportIcon /> },
  { segment: "analytics", title: "Analytics", icon: <BarChartIcon /> },
  { segment: "settings", title: "Settings", icon: <SettingsIcon /> },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Gradient Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <Gradient />
      </div>

      {/* Sidebar */}
      <aside className="navbar fixed top-0 left-0 h-full w-64 shadow-2xl font-poppins">
        <div className="w-full p-5 flex gap-2 ">
          {/* Logo Section */}
          <div className="w-full text-2xl flex items-center gap-2 pl-7 pt-4">
            <img src={logo} alt="Logo" className="w-12 h-12" />
            <span>S.E.R.V</span>
          </div>
        </div>
        <nav className="mt-8 space-y-2 pl-7">
          {NAVIGATION.map((item) => (
            <div
              key={item.segment}
              className="adminnav flex items-center p-3 cursor-pointer"
              onClick={() => navigate(`/admin/${item.segment}`)} // Navigate on click
            >
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64">
        <AdminHeader />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
