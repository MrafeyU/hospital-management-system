// src/components/admin/BillingTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/admin/BillingTable.css";

const BillingTable = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/admin/billing")
      .then((res) => setBills(res.data))
      .catch((err) => console.error("Error fetching bills:", err));
  }, []);

  return (
    <div className="user-table">
      <h2>Billing Records</h2>
      <table>
        <thead>
          <tr>
            <th>Bill No</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Time</th>
            <th>Amount (Rs.)</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.bill_no}>
              <td>{bill.bill_no}</td>
              <td>{bill.patient_name}</td>
              <td>{bill.date}</td>
              <td>{bill.time}</td>
              <td>{bill.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingTable;
