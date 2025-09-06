
import React from "react";
import TopBar from "../../components/TopBar";
import SideBar from "../../components/SideBar";
import Console from "../../components/Console";
import Chatbot from "../../components/Chatbot";

import DoctorInfoCard from "../../components/doctors/DoctorInfoCard";
import DoctorProfileUpdateCard from "../../components/doctors/DoctorProfileUpdateCard";
const DoctorDashboard = () => {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <Console>

          <DoctorInfoCard />
          <DoctorProfileUpdateCard/>
          

          <Chatbot/>
        </Console>
      </div>

     
    </div>
  );
};

export default DoctorDashboard;


