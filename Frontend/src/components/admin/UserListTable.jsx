import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/Users.css";


const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const deleteUser = async (uid) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${uid}`);
      setUsers((prev) => prev.filter((user) => user.uid !== uid));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="user-table">
      <h2>Registered Users</h2>
      <table>
        <thead>
          <tr>
            <th>UID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Action</th> {/* New Column */}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.uid}>
              <td>{u.uid}</td>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>
                <button className="remove-button" onClick={() => deleteUser(u.uid)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
