import React from "react";
import ErrorBoundary from "../components/Error/error-boundary";

const Sample = () => {
  return (
    <div>
      <ErrorBoundary>
        <h1>hi</h1>
        <h2>{{}}</h2>
      </ErrorBoundary>
    </div>
  );
};

export default Sample;
