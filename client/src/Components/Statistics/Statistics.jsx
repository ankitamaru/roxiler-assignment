import React, { useState, useEffect } from "react";
import axios from "axios";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/statistics`,
        {
          params: { month },
        }
      );
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  return (
    <div>
      <div className="container mt-5">
        <div className="row mt-3">
          <h2>Statistics :{month}</h2>
        </div>
      
      <div className="row">
        <div className="col-md-4">
          <div class="card text-bg-primary mb-3" >
            <div class="card-header">Sale Amount</div>
            <div class="card-body">
              <h5 class="card-title">Total Sale Amount:</h5>
              <p class="card-text">
              {statistics.totalSaleAmount}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div class="card text-bg-success mb-3" >
            <div class="card-header">Sold Items</div>
            <div class="card-body">
              <h5 class="card-title">Total Sold Items:</h5>
              <p class="card-text">
              {statistics.totalSoldItems}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div class="card text-bg-danger mb-3" >
            <div class="card-header">Not Sold Items</div>
            <div class="card-body">
              <h5 class="card-title">Total Not Sold Items: </h5>
              <p class="card-text">
              {statistics.totalNotSoldItems}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      
    </div>
  );
};

export default Statistics;
