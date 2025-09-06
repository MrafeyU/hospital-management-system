import React from "react";
import { useAuth } from "../api/authContext"; // Auth hook
import "../styles/Layout.css"; // Import CSS
import Logo from "../logo/hmslogo.png";
import Logout from "../logo/logout.png";
const TopBar = () => {
  const { user, logout, userRole } = useAuth(); // Fetch user role

  return (
          <div className="topbar">
            {/* Left: Logo */}
            <div className="topbar-left">
              <img src={Logo} alt="HMS Logo" className="hms-logo" />
            </div>

            {/* Center: Web Name */}
            <div className="topbar-center">
              <span className="web-name">HospiSyncAI</span>
            </div>

            {/* Right: Logout or Icon */}
            <div className="topbar-right">
  <span className="user-email">{user?.email}</span>
  <button onClick={logout} className="logout-button">
    Logout
  </button>
  {/* Logout icon for small screens */}
  <img
    src={Logout}
    alt="Logout"
    className="logout-icon"
    onClick={logout}
    title="Logout"
  />
</div>
          </div>
  );
};

export default TopBar;
