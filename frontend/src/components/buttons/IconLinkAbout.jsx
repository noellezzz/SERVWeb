import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Links.css";

const IconLinkAbout = ({ icon: Icon }) => {
  return (
    <Link to="/about" className="icon-link">
      <p>About</p>
      {Icon && <span className="icon">{<Icon />}</span>}
    </Link>
  );
};

export default IconLinkAbout;