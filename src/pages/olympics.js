import React from "react";
import ViewOlymicsData from "../components/Data/viewolympicdata";
import ErrorBoundary from "../components/Error/error-boundary";

const Olympics = () => {
  return (
    <div>
      <ErrorBoundary>
        <ViewOlymicsData />
      </ErrorBoundary>
    </div>
  );
};

export default Olympics;
