import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/doctor");
  };

  return (
    <div className="home">
      <div className="content">
        <h1>Welcome to </h1>
        <h1>Veterinary Management System</h1>
        <button onClick={handleClick}>Start using</button>
      </div>
    </div>
  );
}

export default Home;
