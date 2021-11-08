import React from "react";
import ViewFilmData from "../components/Data/viewfilmdata";
import ViewMySqlData from "../components/Data/viewmysqldata";

export const Movies = () => {
  return (
    <div>
      <ViewMySqlData />
      <div>{/* <ViewFilmData></ViewFilmData> */}</div>
    </div>
  );
};
