import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom"; // Import Link
import Gradient from "../../components/Gradient";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar";


const AdminLayout = () => {

  return (
    <div>
      {/* Gradient Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        {/* <Gradient /> */}
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64">
        <AdminHeader />
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
