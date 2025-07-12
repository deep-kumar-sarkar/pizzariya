import "./OutletList.css";
import React from "react";
import { useNavigate } from "react-router-dom";

const OutletList = ({ outlets, onSelectOutlet }) => {
  const navigate = useNavigate();

  const handleSelect = (outlet) => {
    onSelectOutlet(outlet); // Pass the selected outlet to the parent
    navigate("/menu"); // Navigate to the Menu page
  };

  return (
    <div className="outlet-list">
      {outlets.map((outlet) => (
        <div
          key={outlet.id}
          className="outlet-button"
          onClick={() => handleSelect(outlet)}
        >
          {outlet.name}
          
        </div>
      ))}
    </div>
  );
};

export default OutletList;
