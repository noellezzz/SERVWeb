import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom"; // Import Link
import Gradient from "../../components/Gradient";
import AdminHeader from "./AdminHeader";
import Sidebar from "./Sidebar";


const AdminLayout = () => {


  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        {/* <Gradient /> */}
      </div>

      <div className="flex h-screen font-poppins">

        {/* Sidebar */}
        <Sidebar />



        {/* Main Content */}
        <main className="flex-1 bg-gray-100 overflow-y-auto no-scrollbar">
          <AdminHeader />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
