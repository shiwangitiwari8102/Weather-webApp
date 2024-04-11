import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  // State to track whether the navbar content is collapsed or not
  const [collapsed, setCollapsed] = useState<boolean>(true);

  // Function to toggle the collapsed state
  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container" style={{ fontFamily: 'Georgia, serif', fontWeight: 'bolder' }}>
        <Link className="navbar-brand" to="/">Weather Web App</Link>
        {/* Button to toggle the collapsed state */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-expanded={!collapsed ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Navbar content */}
        <div className={`collapse navbar-collapse ${collapsed ? '' : 'show'}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item ms-5">
              <Link className="nav-link" to="/" style={{ color: '#135D66' }}>Cities Data</Link>
            </li>
            <li className="nav-item ms-5">
              <Link className="nav-link " to="/weather" style={{ color: '#135D66' }}>Weather Information</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
