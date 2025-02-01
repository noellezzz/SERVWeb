import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Links.css";

const IconLink = ({ icon: Icon }) => {
  return (
    <Link to="/evaluation" className="icon-link">
      <p>Try Now</p>
      {Icon && <span className="icon">{<Icon />}</span>}
    </Link>
  );
};

export default IconLink;