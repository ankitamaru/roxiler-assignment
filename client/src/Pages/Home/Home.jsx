import React from "react";
import Header from "../../Components/Header/Header";
import Table from "../../Components/Transactions/TransactionsTable";
import Statistics from "../../Components/Statistics/Statistics";
import CustomBarChart from "../../Components/BarChart/BarChart";

const Home = ({month}) => {

  
  return (
    <div>
      <Header />
      <Table month={month} />
      <Statistics month={month} />
      <CustomBarChart month={month} />
    </div>
  );
};

export default Home;
