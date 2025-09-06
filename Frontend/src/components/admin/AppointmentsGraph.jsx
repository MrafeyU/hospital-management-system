import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AppointmentsGraph  = ({
  title = "User Distribution by Role",
  endpoint = "http://localhost:5001/api/admin/bar-chart/user-role",
  xKey = "label",
  yKey = "value",
  barColor = "#8884d8",
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Bar chart fetch error:", err));
  }, [endpoint]);

  return (
    <div className="dashboard-card">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} fill={barColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AppointmentsGraph ;
