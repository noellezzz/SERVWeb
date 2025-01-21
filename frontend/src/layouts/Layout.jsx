import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Gradient from "../components/Gradient";

const Layout = () => {
  return (
    <>
      <div className="fixed top-0 left-0 border border-red-600 w-full h-full -z-10">
        <Gradient />
      </div>
      <Header className="relative z-10" />
      <Outlet className="relative z-10" />
    </>
  );
};

export default Layout;
