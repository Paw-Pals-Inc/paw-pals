import React from "react";
import dogPic from "../../assets/loading icons/icons8-dog-100.png";
import loadingCircle from "../../assets/loading icons/loading_icon.svg";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="loadingIcon">
        <img className="dogIcon" src={dogPic} alt="Dog Icon" />
        <img className="loadingCircle" src={loadingCircle} alt="loading icon" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
