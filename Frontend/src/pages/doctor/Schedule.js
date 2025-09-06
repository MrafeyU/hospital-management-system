import React from "react";
import TopBar from "../../components/TopBar";
import SideBar from "../../components/SideBar";
import Console from "../../components/Console";
import Chatbot from "../../components/Chatbot";

import ManageDoctorSchedule from "../../components/doctors/ManageDoctorSchedule";
import App from "../../App";
const Schedule = () => {
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
        <ManageDoctorSchedule/>
        <Chatbot/>
      </Console>
        </div>
      </div>
    </div>
  );
};

export default Schedule ;
