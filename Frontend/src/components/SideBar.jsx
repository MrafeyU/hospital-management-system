
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../api/authContext";
// import "../styles/Layout.css"; // Import CSS

// const SideBar = () => {
//   const { userRole } = useAuth();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const navItems = {
//     admin: [
//       { name: "Dashboard", path: "/admin" },
//       { name: "Manage Users", path: "/admin/users" },
//       { name: "Appointments", path: "/admin/appointments" },
//       { name: "Reports", path: "/admin/reports" },
//       { name: "Billing", path: "/admin/billing" },
//     ],
//     doctor: [
//       { name: "Dashboard", path: "/doctor" },
//       { name: "Patients", path: "/doctor/patients" },
//       { name: "Appointments", path: "/doctor/appointments" },
//       { name: "Vitals Monitoring", path: "/doctor/vitals" },
//       { name: "Schedule", path: "/doctor/schedule" },
//     ],
//     patient: [
//       { name: "Dashboard", path: "/patient" },
//       { name: "Book Appointment", path: "/patient/appointments" },
//       { name: "Medical History", path: "/patient/history" },
//       { name: "Billing", path: "/patient/bills" },
//       { name: "Vitals", path: "/patient/vitals" },
//     ],
//   };

//   return (
//     <>
//       <div className="sidebar">
//         <ul>
//           {navItems[userRole]?.map((item, index) => (
//             <li key={index}>
//               <Link 
//                 to={item.path} 
//                 onClick={() => setMenuOpen(false)}
//               >
//                 {item.name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Page Overlay */}
//       <div className={`page-overlay ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(false)}></div>
//     </>
//   );
// };

// export default SideBar;





import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../api/authContext";
import "../styles/Layout.css";
import { FiMenu, FiX, FiHome, FiUsers, FiCalendar, FiFileText, FiDollarSign, FiUserCheck, FiClock, FiActivity, FiBookOpen } from "react-icons/fi";

const SideBar = () => {
  const { userRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navIcons = {
    Dashboard: <FiHome />,
    "Manage Users": <FiUsers />,
    Appointments: <FiCalendar />,
    Reports: <FiFileText />,
    Billing: <FiDollarSign />,
    Patients: <FiUserCheck />,
    "Vitals Monitoring": <FiActivity />,
    Schedule: <FiClock />,
    "Book Appointment": <FiCalendar />,
    "Medical History": <FiBookOpen />,
    Vitals: <FiActivity />
  };

  const navItems = {
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Manage Users", path: "/admin/users" },
      { name: "Appointments", path: "/admin/appointments" },
      { name: "Reports", path: "/admin/reports" },
      { name: "Billing", path: "/admin/billing" },
    ],
    doctor: [
      { name: "Dashboard", path: "/doctor" },
      { name: "Patients", path: "/doctor/patients" },
      { name: "Appointments", path: "/doctor/appointments" },
      { name: "Vitals Monitoring", path: "/doctor/vitals" },
      { name: "Schedule", path: "/doctor/schedule" },
    ],
    patient: [
      { name: "Dashboard", path: "/patient" },
      { name: "Book Appointment", path: "/patient/appointments" },
      { name: "Medical History", path: "/patient/history" },
      { name: "Billing", path: "/patient/bills" },
      { name: "Vitals", path: "/patient/vitals" },
    ],
  };

  return (
    <>
      {/* Hamburger Menu */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </div>

      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <ul>
          {navItems[userRole]?.map((item, index) => (
            <li key={index}>
              <Link to={item.path} onClick={() => setMenuOpen(false)}>
                <span className="sidebar-icon">{navIcons [item.name]}</span>
                <span className="sidebar-label">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Page Overlay */}
      <div
        className={`page-overlay ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      ></div>
    </>
  );
};

export default SideBar;