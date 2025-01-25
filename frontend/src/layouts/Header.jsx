import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Header() {
  return (
    <div className="px-4">
      <div className="top-0 left-0 w-full border-b-4 p-5 flex gap-2 font-poppins">
        <div className="w-full text-2xl flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <span>S.E.R.V</span>
        </div>
        <div className="w-full flex justify-end gap-6 items-center">
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
