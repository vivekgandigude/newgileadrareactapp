import React from "react";
import { useHistory } from "react-router-dom";

import { PrimaryButton } from "@fluentui/react/lib/Button";
const AppHome = () => {
  const history = useHistory();
  const _alertClicked = () => {
    history.push("/home");
  };
  return (
    <div>
      <div>
        <PrimaryButton text="View" onClick={_alertClicked} />
      </div>
    </div>
  );
};

export default AppHome;
