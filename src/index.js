import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { store } from "./redux/store";
import { Provider } from "react-redux";
import serviceworker from "./serviceWorker";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceworker();
//console.log('public url: ', process.env.PUBLIC_URL)