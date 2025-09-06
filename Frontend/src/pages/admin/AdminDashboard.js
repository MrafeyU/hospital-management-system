import React from "react";
import TopBar from "../../components/TopBar";
import SideBar from "../../components/SideBar";
import Console from "../../components/Console";
import Chatbot from "../../components/Chatbot";

import AdminUserStatsCard from "../../components/admin/AdminUserStatsCard";
import AppointmentStatsCard from "../../components/admin/AppointmentStatsCard";
import AppointmentsGraph from "../../components/admin/AppointmentsGraph";


const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar takes fixed width */}
      <SideBar />

      {/* Main Content (Flex column for top bar + content) */}
      <div className="flex flex-col flex-1">
        <TopBar />
        
        {/* Content Area */}
        <div className="p-6 bg-gray-100 flex-1 overflow-auto">
      <Console>
          {/* <h1 className="dashboard-title">Welcome, Admin!</h1> */}

          {/* Stats Card */}
          <AdminUserStatsCard />

          {/* Appointment Stats */}
          <AppointmentStatsCard/>

          {/* Appointment Graphs */}
          <AppointmentsGraph/>

          <Chatbot/>
      </Console>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
