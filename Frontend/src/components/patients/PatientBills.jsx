import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import "../../styles/patients/PatientBills.css";

const PatientBills = () => {
  const [bills, setBills] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const auth = getAuth();

  // 🔄 Fetch patient_id using Firebase UID
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      axios
        .post("http://localhost:5001/getPatientId", { uid })
        .then((res) => setPatientId(res.data.patient_id))
        .catch((err) => console.error("❌ Failed to fetch patient ID", err));
    }
  }, []);

  // 🔄 Fetch bills once patient_id is available
  useEffect(() => {
    if (patientId) {
      axios
        .get(`http://localhost:5001/patient-bills/${patientId}`)
        .then((res) => setBills(res.data))
        .catch((err) => console.error("❌ Failed to fetch bills", err));
    }
  }, [patientId]);

  return (
    <div className="bills-card">
      <h2> Your Bills</h2>
      {bills.length === 0 ? (
        <p className="no-bills">No bills found.</p>
      ) : (
        <table className="bills-table">
          <thead>
            <tr>
              <th>Bill No</th>
              <th>Date</th>
              <th>Time</th>
              <th>Amount (₨)</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.bill_no}>
                <td>{bill.bill_no}</td>
                <td>{new Date(bill.date).toLocaleDateString()}</td>
                <td>{bill.time}</td>
                <td>{bill.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PatientBills;
