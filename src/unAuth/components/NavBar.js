import React from "react";
import "./NavBar.css";

function NavBar() {
  return (
    <div className="navbar">
      <img src={require("../../assets/Happy.png")} alt="Logo" className="logo" />
      <span>NavBar Component</span>
    </div>
  );
}

export default NavBar;
