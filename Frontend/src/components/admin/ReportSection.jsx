import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/admin/ReportSection.css"; // We’ll add this CSS next

const ReportSection = ({ userId }) => {
  const [reports, setReports] = useState([]);
  const [title, setTitle] = useState("");

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/reports");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const generateReport = async () => {
    if (!title) return;
    try {
      await axios.post("http://localhost:5001/api/reports/generate", {
        title,
        uid: userId, // Pass actual user UID from context
      });
      setTitle("");
      fetchReports();
    } catch (err) {
      console.error("Error generating report:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="report-section">
      <h2>Reports</h2>
      <div className="report-form">
        <input
          type="text"
          placeholder="Enter report title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={generateReport}>Generate Report</button>
      </div>
      <div className="report-list">
        {reports.map((report) => (
          <div key={report.report_id} className="report-item">
            <strong>{report.report_title}</strong>
            <span> — {new Date(report.generated_on).toLocaleString()}</span>
            <a
              href={`http://localhost:5001${report.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-link"
            >
              View Report
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportSection;