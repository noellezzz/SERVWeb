import React from "react";
import { Link } from "react-router-dom";
import { Notifications as NotificationsIcon, Person as PersonIcon } from "@mui/icons-material"; // Import Material UI icons
import { IconButton } from "@mui/material"; // Import IconButton for clickable icons

import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "@/states/slices/theme.slice";
import { ChevronRight } from "@mui/icons-material";

function AdminHeader() {
  const dispatch = useDispatch();
  const { isSidebarOpen } = useSelector((state) => state.theme);
  return (
    <div className="header w-full p-5 flex gap-2 font-poppins shadow-xl h-24">
      {/* Sidebar Toggle Button */}

      {!isSidebarOpen && <button
        className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md"
        onClick={() => dispatch(toggleSidebar())}
      >
        <ChevronRight />
      </button>}

      {/* Links Section with Icons */}
      <div className="w-full flex justify-end gap-6  items-center">
        <Link to="notifications">
          <IconButton color="inherit">
            <NotificationsIcon />
          </IconButton>
        </Link>
        <Link to="profile">
          <IconButton color="inherit">
            <PersonIcon />
          </IconButton>
        </Link>
      </div>
    </div>
  );
}

export default AdminHeader;
