import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state;
  console.log(userName);
  const userValid = () => {
    let token = localStorage.getItem("userdbtoken");
    if (token) {
      console.log("user valid");
    } else {
      navigate("*");
    }
  };

  useEffect(() => {
    userValid();
    // eslint-disable-next-line
  }, []);
  return (
    <div className="dashboard">
      <h1>Welcome to Home page</h1>
      <div className="content-container">
        <h2 className="content">This is the confidential content.</h2>
        <h2 className="content">account: {location.state}</h2>
        <button
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            outline: 0,
            border: "none",
          }}
          className="content"
        >
          <NavLink to="/" style={{ color: "white", textDecoration: "none" }}>
            Logout
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
