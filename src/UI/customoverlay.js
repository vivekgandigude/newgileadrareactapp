import React from "react";
import "../components/Data/view.css";
const GridOverlay = (props) => {
  return (
    <div
      className="ag-overlay-loading-center"
      style={{
        backgroundColor: "lightblue",
        height: "100px",
        width: "50%",
      }}
    >
      <i className="fas fa-hourglass-half"> {props.loadingMessage} </i>
    </div>
  );
};

export default GridOverlay;
