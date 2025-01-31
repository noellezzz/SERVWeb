import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut, useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BarChartIcon from "@mui/icons-material/BarChart";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupIcon from "@mui/icons-material/Group";
import ReportIcon from "@mui/icons-material/Description";


const NAVIGATION = [
  { segment: "", title: "Dashboard", icon: <DashboardIcon /> },
  { segment: "reports", title: "Reports", icon: <ReportIcon /> },
  { segment: "users", title: "Users", icon: <GroupIcon /> },
  { segment: "analytics", title: "Analytics", icon: <BarChartIcon /> },
  { segment: "assessments", title: "Assessments", icon: <NoteAltIcon /> },
  { segment: "settings", title: "Settings", icon: <SettingsIcon /> },
];

function Sidebar() {
  const navigate = useNavigate();
  const [navItems, setNavItems] = useState(NAVIGATION);
  const [current, setCurrent] = useState("");
  const active = "bg-primary text-white rounded-l-full";


  return (

    <aside className="navbar fixed top-0 left-0 h-full w-64 shadow-2xl font-poppins">
      <div className="w-full p-5 flex gap-2 ">
        {/* Logo Section */}
        <div className="w-full text-2xl flex items-center gap-2 pl-7 pt-4">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <span>S.E.R.V</span>
        </div>
      </div>
      <nav className="mt-8 space-y-2 pl-7">
        {navItems.map((item) => (
          <div
            key={item.segment}
            className={`flex items-center p-3 cursor-pointer ${current === item.segment ? active : ""
              } `}
            onClick={() => {
              navigate(`/admin/${item.segment}`);
              setCurrent(item.segment);
            }}
          >
            {item.icon}
            <span className="ml-2">{item.title}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
