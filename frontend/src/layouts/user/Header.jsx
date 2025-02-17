import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/SERV_Logo.png";
import wordmark from "../../assets/SERV-adm.png";

function Header() {
  return (
    <div className="px-4 shadow-lg">
      <div className="top-0 left-0 w-full p-5 flex gap-2 font-poppins">
        <div className="w-full text-6xl flex items-center gap-1">
          <img src={logo} alt="Logo" className="w-14 h-14" />
          <img src={wordmark} alt="Word Mark" className="h-9" />
        </div>
        <div className="w-full flex justify-end gap-6 items-center">
          <Link 
            className="text-white font-bold hover:bg-white hover:bg-opacity-30 p-2 rounded"
            to="/"
          >
            Home
          </Link>
          <Link 
            className="text-white font-bold hover:bg-white hover:bg-opacity-30 p-2 rounded"
            to="/evaluation"
          >
            Evaluation
          </Link>
          <Link 
            className="text-white font-bold hover:bg-white hover:bg-opacity-30 p-2 rounded"
            to="/services"
          >
            Services
          </Link>
          <Link 
            className="text-white font-bold hover:bg-white hover:bg-opacity-30 p-2 rounded"
            to="/about"
          >
            About
          </Link>
          <Link 
            className="text-white font-bold hover:bg-white hover:bg-opacity-30 p-2 rounded"
            to="/contact"
          >
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
