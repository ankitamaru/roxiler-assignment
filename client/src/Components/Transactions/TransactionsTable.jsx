import React, { useEffect, useState } from "react";
import axios from "axios";

const Table = ({ month }) => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [months, setMonths] = useState("March");

  
  const fetchTransactions = async (searchTerm = "", selectedMonth = month) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/transactions`,
        {
          params: {
            month,
            months: selectedMonth,
            search: searchTerm,
            page,
            perPage,
          },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.log("Error fetching transactions: ", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, page]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    fetchTransactions(e.target.value);
  };

  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonths(selectedMonth);
    setPage(1);
    fetchTransactions(search, selectedMonth);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-4">
            <form class="d-flex" role="search">
              <input
                class="form-control me-2"
                type="search"
                value={search}
                onChange={handleSearch}
                placeholder="Search transactions"
              />
            </form>
          </div>
          <div className="col-md-4"></div>
          <div className="col-md-4">
            <select
              class="form-select"
              aria-label="Default select example"
              value={months}
              onChange={handleMonthChange}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
        </div>

        <div className="row mt-5">
          <table className="table table-hover table-responsive w-100">
            <thead>
              <tr>
                {/* <th className="p-3">Id</th> */}
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3">Sold</th>
                <th className="p-3">Image</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(
                ({
                  title,
                  description,
                  price,
                  category,
                  dateOfSale,
                  sold,
                  image,
                  _id,
                }) => (
                  <tr key={_id}>
                    <td>{title}</td>
                    <td>{description}</td>
                    <td>{price}</td>
                    <td>{category}</td>
                    <td>{new Date(dateOfSale).toLocaleDateString()}</td>
                    <td>{sold ? "Yes" : "No"}</td>
                    <td>
                      <img
                        src={image}
                        alt={title.image}
                        style={{ maxWidth: "50px" }}
                      />
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <button className="btn btn-primary" onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Table;
