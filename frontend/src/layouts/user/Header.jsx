import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/SERV_Logo.png";
import wordmark from "../../assets/Wordmark.png";

function Header() {
  return (
    <div className="px-4 shadow-lg">
      <div className="top-0 left-0 w-full p-5 flex gap-2 font-poppins">
        <div className="w-full text-2xl flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-12 h-12" />
          <img src={wordmark} alt="Word Mark" className="h-12" />
        </div>
        <div className="w-full flex justify-end gap-6 items-center">
          <Link className="text-white" to="/">
            Home
          </Link>
          <Link className="text-white" to="/evaluation">
            Evaluation
          </Link>
          <Link className="text-white" to="/services">
            Services
          </Link>
          <Link className="text-white" to="/about">
            About
          </Link>
          <Link className="text-white" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;