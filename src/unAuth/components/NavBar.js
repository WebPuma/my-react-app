import React from "react";
import "./NavBar.css";


function NavBar() {
  return (
    <div className="navbar">
      <img src={require("../../assets/Happy.png")} alt="Logo" className="logo" />
      <ul className="navbar-links">
        <li className="active">Home</li>
        <li>Services</li>
        <li>About</li>
      
        <li>Contact</li>
      </ul>
    </div>
  );
}

export default NavBar;
