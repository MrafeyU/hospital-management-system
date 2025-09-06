import React from "react";
import "../styles/Layout.css"; // Import the layout styles

const Console = ({ children }) => {
  return <div className="main-content">{children}</div>;
};

export default Console;
