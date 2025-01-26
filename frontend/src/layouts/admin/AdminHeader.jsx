import React from "react";
import { Link } from "react-router-dom";
import { Notifications as NotificationsIcon, Person as PersonIcon } from "@mui/icons-material"; // Import Material UI icons
import { IconButton } from "@mui/material"; // Import IconButton for clickable icons

function AdminHeader() {
  return (
    <div className="header w-full p-5 flex gap-2 font-poppins shadow-2xl h-24">
      {/* Links Section with Icons */}
      <div className="w-full flex justify-end gap-6 items-center">
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
