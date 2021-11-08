import React from "react";

import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <nav className="headerDiv">
      <Link to="/">Home</Link>

      <Link to="/sample">Employees(MySQL)</Link>
    </nav>
  );
}
export default Header;
