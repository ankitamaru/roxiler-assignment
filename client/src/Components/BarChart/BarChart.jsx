import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CustomBarChart = ({ month }) => {
  const [barData, setBarData] = useState([]);

  const fetchBarData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/bar-chart`,
        {
          params: { month },
        }
      );
      setBarData(response.data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  useEffect(() => {
    fetchBarData();
  }, [month]);

  return (
    <div className="container mt-5">
      <div class="card border-light mb-3">
        <div class="card-header"><h2>Bar Chart Stats</h2></div>
        <div class="card-body">
          <h5 class="card-title">Bar Charts:{month} </h5>
          <BarChart
            width={600}
            height={300}
            data={barData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default CustomBarChart;
