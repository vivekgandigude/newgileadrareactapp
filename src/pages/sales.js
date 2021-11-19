import React from "react";
import ViewSales from "../components/Data/viewsales";
import ErrorBoundary from "../components/Error/error-boundary";
const Sales = () => {
  return (
    <ErrorBoundary>
      <ViewSales />
    </ErrorBoundary>
  );
};
export default Sales;
