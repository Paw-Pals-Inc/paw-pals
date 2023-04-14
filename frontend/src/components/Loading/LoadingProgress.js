import React from "react";
import LoadingSpinner from "./LoadingSpinner";
import "./loading.css";

const LoadingProgress = () => {
  return (
    <div className="loading-progress">
      <h1>Hang tight. Finding paw pals...</h1>
      <LoadingSpinner />
    </div>
  );
};

export default LoadingProgress;
