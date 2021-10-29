import React from "react";
//import { Link } from "@fluentui/react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <nav className="headerDiv">
      <Link to="/">Home</Link>
      {/* <Link to="/home">Dashboard(SQL)</Link>
      <Link to="/sample">Sample(Error Bounday)</Link>
      <Link to="/movies">Dashboard(MySQL)</Link> */}
      <Link to="/employees">Employees(MySQL)</Link>
    </nav>
  );
}
export default Header;
