import React, { useState, useEffect } from "react";
import TopBar from "../../components/TopBar";
import SideBar from "../../components/SideBar";
import Console from "../../components/Console";
import Chatbot from "../../components/Chatbot";

import UserListTable from "../../components/admin/UserListTable";
import RegisterUserForm from "../../components/admin/RegisterUserForm";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch("http://localhost:5001/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Failed to fetch users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <Console>
          
          {/* Table of Users */}
          <UserListTable users={users} onDelete={fetchUsers} />

          {/* Register User Form */}
          <RegisterUserForm onUserRegistered={fetchUsers} />
          <Chatbot/>
        </Console>
      </div>
    </div>
  );
};

export default ManageUsers;
