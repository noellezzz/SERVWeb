import React from "react";
import { Link } from "react-router-dom";
import home from "../assets/home.png";
import "../App.css";

function Home() {
  return (
    <div className="top-0 left-0 w-full h-screen p-5 flex gap-2 font-poppins justify-center items-center">
      <div className="w-full flex-col flex justify-center items-center gap-2">
        <h1 className="text-6xl pb-10">Welcome to S.E.R.V</h1>
        <p className="text-xl px-20 text-justify">
          SERV is a smart web app that evaluates senior citizens' behavior in
          service lines. By combining behavioral tests, feedback, and AI
          analysis, it optimizes queue management, reduces wait times, and
          enhances satisfaction, providing real-time insights for better service
          delivery.
        </p>
        <Link to="/services">
          <button className="bg-[#FCEA96] border border-black rounded-full py-2 px-6 hover:bg-yellow-200">
            Try Now
          </button>
        </Link>
      </div>
      <div className="homepageimg w-full flex justify-center gap-2 items-center">
        <img src={home} alt="Home" />
      </div>
    </div>
  );
}

export default Home;
